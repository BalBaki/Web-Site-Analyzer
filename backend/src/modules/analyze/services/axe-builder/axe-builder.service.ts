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
} from 'src/types';
import { VIOLATION_IMPACT_PRIORTY } from 'src/constants';
import type { Page } from 'playwright';

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

    async analyze({ url, deepscan }: AnalyzePayload): AxeResult {
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
                const validLinks = await this.extractLinks(page, mainUrlAsURL);

                urls = [...new Set(urls.concat(validLinks))];
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
        return await page.evaluate(
            async ({ mainURL, localePatterns }) => {
                const { origin: mainUrlOrigin } = mainURL;

                return Array.from(document.querySelectorAll('a[href]'))
                    .filter((a: HTMLAnchorElement) => {
                        try {
                            const { href, origin } = new URL(a.href);

                            return (
                                origin === mainUrlOrigin &&
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
}
