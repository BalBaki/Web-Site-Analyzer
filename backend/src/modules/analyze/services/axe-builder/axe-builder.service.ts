import { Injectable } from '@nestjs/common';
import { AxeBuilder } from '@axe-core/playwright';
import * as playwright from 'playwright';
import type { AnalyzerTool } from '../../analyzer-tool.interface';
import { Status } from 'src/enums';
import type {
    AxeResult,
    AnalyzePayload,
    AxeViolations,
    HeadingElementData,
    TabbableElementInfo,
    DeviceViewport,
    Device,
    AxeDevice,
    AxePageScanResult,
    AxeResults,
    AxeBuilderStreamData,
} from 'src/types';
import { TOOL_STAGE, VIOLATION_IMPACT_PRIORTY } from 'src/constants';
import type { Page } from 'playwright';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AxeBuilderService implements AnalyzerTool {
    private readonly deviceViewport: DeviceViewport = {
        desktop: { width: 1920, height: 1080 },
        tablet: { width: 768, height: 1024 },
        mobile: { width: 390, height: 844 },
    };
    private readonly localePatterns: RegExp[] = [/^\/[a-z]{2}(-[A-Z]{2})?\//, /\/[a-z]{2}(-[A-Z]{2})?\//];
    private readonly excludedURLParts = ['javascript:', 'mailto:', 'tel:', 'sms:', 'data:', 'ftp:', 'file:'];
    private readonly viewableTypes = ['text/html', 'text/plain', 'application/json', 'application/xml', 'text/xml'];
    private readonly possibleSrOnlyCssOption: Partial<Record<keyof CSSStyleDeclaration, string[]>> = {
        position: ['absolute'],
        width: ['1px'],
        height: ['1px'],
        overflow: ['hidden'],
        clip: ['rect(0px, 0px, 0px, 0px)', 'rect(0, 0, 0, 0)'],
        whiteSpace: ['nowrap'],
    };
    private readonly tabbableSelectors = [
        'a[href]',
        'area[href]',
        'input:not([type="hidden"])',
        'select',
        'textarea',
        'button',
        'iframe',
        'object',
        'embed',
        '[tabindex]:not([tabindex="-1"])',
        '[contenteditable="true"]',
        'audio[controls]',
        'video[controls]',
        'details summary',
        'details:not([disabled])',
        'svg[focusable="true"]',
        '[role="button"]:not([disabled])',
        '[role="link"]:not([disabled])',
    ];

    async analyze({ url, deepscan }: AnalyzePayload, abortController: AbortController): AxeResult {
        const isLinkViewable = await this.checkLinkViewable(url);

        if (!isLinkViewable) return { status: Status.Err, err: 'Cannot scan this url.' };

        const browser = await playwright.chromium.launch();
        const context = await browser.newContext({ viewport: this.deviceViewport.desktop });

        try {
            const mainUrlAsURL = new URL(url);
            const page = await context.newPage();
            let urls = [mainUrlAsURL.href];

            await this.goToPageWithFallback(page, mainUrlAsURL.href, { loadState: { timeout: 5000 } });

            if (deepscan) {
                urls = await this.extractLinks(page, mainUrlAsURL);
            }

            return { status: Status.Ok, data: await this.scan(page, urls) };
        } catch (error) {
            console.error(error);

            return { status: Status.Err, err: `Error at AxeBuilder Analyzer..! Check the server console.` };
        } finally {
            await browser.close();
        }
    }

    private async checkLinkViewable(url: string | URL) {
        try {
            const { href } = typeof url === 'string' ? new URL(url) : url;

            if (this.excludedURLParts.some((urlPart) => href.startsWith(urlPart))) return false;

            const res = await fetch(href, { method: 'HEAD' });

            if (!res.ok) return false;

            const contentType = res.headers.get('content-type')?.toLowerCase() || '';

            if (contentType && this.viewableTypes.some((type) => contentType.includes(type))) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    private async goToPageWithFallback(
        page: playwright.Page,
        url: string,
        config?: {
            goto?: Parameters<Page['goto']>[1];
            loadState?: Parameters<Page['waitForLoadState']>[1];
        },
    ) {
        const { goto: gotoOptions, loadState: loadStateOptions = { timeout: 2500 } } = config || {};

        try {
            await page.goto(url, gotoOptions);
            await page.waitForLoadState('networkidle', loadStateOptions);
        } catch (error) {
            await page.waitForLoadState('domcontentloaded', loadStateOptions);
        }
    }

    private async extractLinks(page: playwright.Page, mainURL: URL) {
        let urls = [mainURL.href];

        const otherUrls = await page.evaluate(
            async ({ mainURL, localePatterns }) => {
                const { hostname: mainHostname } = mainURL;

                return Array.from(document.querySelectorAll('a[href]'))
                    .filter((a: HTMLAnchorElement) => {
                        try {
                            const { href, hostname } = new URL(a.href);

                            return (
                                hostname === mainHostname &&
                                !a.hasAttribute('download') &&
                                !localePatterns.some((pattern) => pattern.test(href))
                            );
                        } catch (error) {
                            return false;
                        }
                    })
                    .map((a: HTMLAnchorElement) => a.href.split('#')[0]);
            },
            { mainURL, localePatterns: this.localePatterns },
        );

        for (const url of otherUrls) {
            if (!urls.includes(url) && (await this.checkLinkViewable(url))) urls.push(url);
        }

        return urls;
    }

    private async scan(page: playwright.Page, urls: string[]): Promise<AxeDevice> {
        const result: AxeDevice = { desktop: [], mobile: [], tablet: [] };

        for (const url of urls) {
            try {
                const isLinkViewable = await this.checkLinkViewable(url);

                if (!isLinkViewable) continue;

                if (page.url() !== url) {
                    await this.goToPageWithFallback(page, url);
                }

                for (const device of Object.keys(this.deviceViewport)) {
                    const typedDevice = device as Device;

                    result[typedDevice].push(await this.analyzeForDevice(page, url, typedDevice));
                }
            } catch (error) {
                this.pushErrorToAllDevices(result, url, 'Page crashed..!');
            }
        }

        return result;
    }

    private async analyzeForDevice(
        page: playwright.Page,
        url: string,
        device: Device = 'desktop',
    ): Promise<AxePageScanResult> {
        try {
            await page.setViewportSize(this.deviceViewport[device]);

            const [analyzeResult, headingTree, tabNavigationOrder] = await Promise.all([
                new AxeBuilder({ page }).analyze(),
                this.extractHeadingTree(page),
                this.extractTabNavigationOrder(page),
            ]);

            return {
                status: Status.Ok,
                url,
                data: {
                    violations: this.formatResult(analyzeResult),
                    headingTree,
                    tabNavigationOrder,
                },
            };
        } catch {
            return {
                status: Status.Err,
                err: 'Error at analyzing page..!',
                url,
            };
        }
    }

    private async extractHeadingTree(page: playwright.Page) {
        return await page.evaluate(
            async ({ srCssOption }) => {
                let headings: HeadingElementData[] = [];
                const headingElements: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
                    Array.from({ length: 6 }, (_, i) => `h${i + 1}`).join(','),
                );

                if (headingElements.length > 0) {
                    headingElements.forEach((element) => {
                        const elementStyle = window.getComputedStyle(element);

                        headings.push({
                            level: element.tagName,
                            text: element.textContent,
                            outerHTML: element.outerHTML,
                            srOnly:
                                element.classList.contains('sr-only') ||
                                Object.entries(srCssOption).every(([key, value]) => value.includes(elementStyle[key])),
                        });
                    });
                }

                return headings;
            },
            { srCssOption: this.possibleSrOnlyCssOption },
        );
    }

    private async extractTabNavigationOrder(page: playwright.Page): Promise<TabbableElementInfo[]> {
        return await page.evaluate(
            async ({ tabbableSelectors }) => {
                return Array.from(document.querySelectorAll(tabbableSelectors.join(','))).reduce(
                    (result: TabbableElementInfo[], elem) => {
                        const tabIndex = parseInt(elem.getAttribute('tabIndex')) || 0;
                        const isVisible = elem.checkVisibility({ checkVisibilityCSS: true });

                        if (tabIndex > -1 && isVisible) {
                            const childImage = elem.querySelector('img');

                            result.push({
                                elementType: elem.localName === 'a' ? 'link' : elem.localName,
                                tabIndex,
                                text: !!childImage ? `Image (Alt: ${childImage.alt})` : elem.textContent,
                                ariaLabel: elem.ariaLabel,
                                title: elem.getAttribute('title'),
                                name: elem.getAttribute('name'),
                                disabled: 'disabled' in elem ? (elem as any).disabled : false,
                            });
                        }

                        return result;
                    },
                    [],
                );
            },
            { tabbableSelectors: this.tabbableSelectors },
        );
    }

    private formatResult(result: AxeResults): AxeViolations {
        return result.incomplete
            .concat(result.violations, result.inapplicable)
            .reduce((acc: AxeViolations, axeResult) => {
                if (axeResult.nodes.length === 0) return acc;

                const normalizedResult: AxeViolations[number] = {
                    ...axeResult,
                    impact: axeResult.impact || 'trivial',
                };

                for (const node of normalizedResult.nodes) {
                    node.all = node.all
                        .concat(node.any, node.none)
                        .filter((checkResult) => checkResult.relatedNodes.length > 0);

                    delete node.any;
                    delete node.none;
                }

                acc.push(normalizedResult);

                return acc;
            }, [])
            .sort((a, b) => VIOLATION_IMPACT_PRIORTY[b.impact] - VIOLATION_IMPACT_PRIORTY[a.impact]);
    }

    private async pushErrorToAllDevices(result: AxeDevice, url: string, err: string = 'Something went wrong') {
        for (const device of Object.keys(this.deviceViewport)) {
            result[device].push({
                status: Status.Err,
                err,
                url,
            });
        }
    }

    analyzeStream$(
        { url, deepscan }: AnalyzePayload,
        abortController: AbortController,
    ): Observable<AxeBuilderStreamData> {
        const progressSubject = new Subject<AxeBuilderStreamData>();

        this.runStreamAnalysis(url, deepscan, progressSubject, abortController).catch((error) => {
            progressSubject.error({
                status: Status.Err,
                message: error.message || 'AxeBuilder analysis failed',
                stage: TOOL_STAGE.COMMON.TOOL_ERROR,
            });
        });

        return progressSubject.asObservable();
    }

    private async runStreamAnalysis(
        url: string,
        deepscan: boolean,
        progressSubject: Subject<AxeBuilderStreamData>,
        abortController: AbortController,
    ): Promise<void> {
        let browser: playwright.Browser;

        try {
            const isLinkViewable = await this.checkLinkViewable(url);

            if (!isLinkViewable) {
                progressSubject.error({
                    status: Status.Err,
                    message: 'Cannot scan downloadable url.',
                    stage: TOOL_STAGE.COMMON.TOOL_ERROR,
                });

                return;
            }

            browser = await this.launchBrowser(progressSubject, abortController);

            const context = await browser.newContext({ viewport: this.deviceViewport.desktop });
            const page = await context.newPage();
            const mainUrlAsURL = new URL(url);
            let urls = [mainUrlAsURL.href];

            await this.goToPageWithFallback(page, mainUrlAsURL.href, { loadState: { timeout: 5000 } });

            if (deepscan) {
                progressSubject.next({
                    stage: TOOL_STAGE.AXE.LINK_EXTRACTION,
                    message: 'Extracting links for deep scan...',
                });

                urls = await this.extractLinks(page, mainUrlAsURL);
            }

            progressSubject.next({
                stage: TOOL_STAGE.AXE.LINK_EXTRACTION_COMPLETE,
                message: `Found ${urls.length} URLs to analyze`,
                urls,
            });

            await this.streamingScan$(page, urls, progressSubject);

            progressSubject.complete();
        } catch (error) {
            console.error('Streaming analysis error:', error);

            progressSubject.error({
                stage: TOOL_STAGE.COMMON.COMPLETE_TOOL,
                message: 'Axebuilder Analysis failed',
            });
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    private async streamingScan$(
        page: playwright.Page,
        urls: string[],
        progressSubject: Subject<AxeBuilderStreamData>,
    ): Promise<void> {
        const result: AxeDevice = { desktop: [], mobile: [], tablet: [] };
        const devices = Object.keys(this.deviceViewport) as Device[];

        for (const [urlIndex, url] of urls.entries()) {
            try {
                progressSubject.next({
                    stage: TOOL_STAGE.AXE.URL_PROCESSING,
                    message: `Processing URL ${urlIndex + 1}/${urls.length}: ${url}`,
                    currentUrl: url,
                    urlIndex: urlIndex + 1,
                    totalUrls: urls.length,
                });

                if (page.url() !== url) {
                    await this.goToPageWithFallback(page, url);
                }

                for (const device of devices) {
                    try {
                        const deviceResult = await this.analyzeForDevice(page, url, device);

                        result[device].push(deviceResult);
                    } catch (error) {
                        console.error(`Error analyzing ${device} for ${url}:`, error);

                        this.pushErrorToAllDevices(result, url, 'Device analysis failed');
                    }
                }

                progressSubject.next({
                    stage: TOOL_STAGE.AXE.URL_PROCESS_COMPLETE,
                    message: `URL ${url} analysis completed`,
                    currentUrl: url,
                    urlIndex: urlIndex + 1,
                    totalUrls: urls.length,
                });
            } catch (error) {
                console.error(`Error processing URL ${url}:`, error);

                this.pushErrorToAllDevices(result, url, 'Page crashed..!');
            }
        }

        progressSubject.next({
            stage: TOOL_STAGE.COMMON.COMPLETE_TOOL,
            message: 'Axebuilder analysis completed successfully',
            result: {
                status: Status.Ok,
                data: result,
            },
        });
    }

    private async launchBrowser(
        progressSubject: Subject<AxeBuilderStreamData>,
        abortController: AbortController,
        options?: playwright.LaunchOptions,
    ): Promise<playwright.Browser> {
        const browser = await playwright.chromium.launch(options);

        abortController.signal.addEventListener('abort', async () => {
            try {
                console.log('Client disconnected, cleaning up browser...');

                await browser.close();
            } catch (error) {
                console.error('Error closing browser:', error);
            }

            progressSubject.complete();
        });

        return browser;
    }
}
