import { Injectable } from '@nestjs/common';
import { AxeBuilder } from '@axe-core/playwright';
import * as playwright from 'playwright';
import type { AnalyzePayload, AxePageScanResult, AxeResult } from 'src/types';
@Injectable()
export class AxeBuilderService {
    private localePatterns: RegExp[] = [/^\/[a-z]{2}(-[A-Z]{2})?\//, /\/[a-z]{2}(-[A-Z]{2})?\//];
    private excludedURLParts = ['javascript:', 'mailto:', 'tel:', 'sms:', 'data:', 'ftp:', 'file:'];
    private pageGoToOptions: Parameters<playwright.Page['goto']>[1] = { waitUntil: 'networkidle' };

    async analyze({ url, deepscan }: AnalyzePayload) {
        const browser = await playwright.chromium.launch({ headless: true });

        try {
            const mainUrlAsURL = new URL(url);
            const context = await browser.newContext();
            const page = await context.newPage();
            let urls = [mainUrlAsURL.href];

            await page.goto(mainUrlAsURL.href, this.pageGoToOptions);

            if (deepscan) {
                const validLinks = await this.extractLinks(page, mainUrlAsURL);

                urls = [...new Set(urls.concat(validLinks))];
            }

            return await this.scan(page, urls);
        } catch (error) {
            console.error(error);

            return { error: `Error at AxeBuilder Analyzer..! Check the server console.` };
        } finally {
            await browser.close();
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
    private async scan(page: playwright.Page, urls: string[]): Promise<AxePageScanResult[]> {
        const results = [];

        for (const url of urls) {
            try {
                const isLinkDownloadable = await this.checkLinkDownloadable(url);

                if (!isLinkDownloadable) {
                    await page.goto(url, this.pageGoToOptions);

                    results.push({ url, result: this.formatResult(await new AxeBuilder({ page }).analyze()) });
                }
            } catch (error) {
                results.push({ url, error: 'Page Crashed..!' });
            }
        }

        return results;
    }
    private async checkLinkDownloadable(url: string | URL) {
        try {
            const { href } = typeof url === 'string' ? new URL(url) : url;

            if (this.excludedURLParts.some((urlPart) => href.startsWith(urlPart))) return true;

            const res = await fetch(href, { method: 'HEAD' });

            if (!res.ok) return true;

            const contentType = res.headers.get('content-type');
            const disposition = res.headers.get('content-disposition');

            return (
                (disposition && disposition.includes('attachment')) ||
                (contentType && !contentType.includes('text/html'))
            );
        } catch (error) {
            return true;
        }
    }
    private formatResult(result: Awaited<ReturnType<AxeBuilder['analyze']>>): AxeResult {
        return result.incomplete
            .concat(result.violations, result.inapplicable)
            .filter((result) => result.nodes.length > 0)
            .map((result) => {
                if (!result.impact) {
                    result = Object.assign(result, { impact: 'trivial' });
                }

                result.nodes.forEach((node) => {
                    node.all = node.all.concat(node.any, node.none).filter((data) => data.relatedNodes.length > 0);
                    delete node.any;
                    delete node.none;
                });

                return result;
            });
    }
}
