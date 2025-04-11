import { Injectable } from '@nestjs/common';
import { AxeBuilder } from '@axe-core/playwright';
import * as playwright from 'playwright';
import type { AnalyzePayload } from 'src/types';

@Injectable()
export class AxeBuilderService {
    private localePatterns: RegExp[] = [
        /^\/[a-z]{2}(-[A-Z]{2})?\//, // Matches patterns like /en/, /en-US/, /tr/, etc.
        /\/[a-z]{2}(-[A-Z]{2})?\//, // Matches patterns like /something/en/page, /page/fr-CA/
    ];
    private excludedURLParts = ['javascript:', 'mailto:', 'tel:', 'sms:', 'data:', 'ftp:', 'file:'];

    async analyze({ url, deepscan }: AnalyzePayload) {
        const browser = await playwright.chromium.launch({
            headless: true,
        });

        try {
            const urlAsURLObject = new URL(url);
            const context = await browser.newContext();
            const page = await context.newPage();
            const urls = [urlAsURLObject.href];

            await page.goto(urlAsURLObject.href, {
                waitUntil: 'networkidle',
            });

            if (deepscan) {
                const additionalUrls = await page.evaluate(
                    ({ localePatterns, urlAsURLObject, excludedURLParts }) => {
                        return Array.from(document.querySelectorAll('a[href]'))
                            .filter((a: HTMLAnchorElement) => {
                                const { href, origin } = new URL(a.href);

                                return (
                                    !a.hasAttribute('download') &&
                                    !excludedURLParts.some((urlPart) => href.startsWith(urlPart)) &&
                                    !localePatterns.some((pattern) => pattern.test(href)) &&
                                    origin === urlAsURLObject.origin
                                );
                            })
                            .map((a: HTMLAnchorElement) => a.href.split('#')[0]);
                    },
                    {
                        localePatterns: this.localePatterns,
                        urlAsURLObject: urlAsURLObject,
                        excludedURLParts: this.excludedURLParts,
                    },
                );

                additionalUrls.forEach((additionalUrl) => {
                    if (!urls.includes(additionalUrl)) urls.push(additionalUrl);
                });
            }

            const results = [];

            for (const url of urls) {
                try {
                    if (url !== urlAsURLObject.href) {
                        await page.goto(url, {
                            waitUntil: 'networkidle',
                        });
                    }

                    results.push({ url: url, result: this.parseResult(await new AxeBuilder({ page }).analyze()) });
                } catch (error) {
                    results.push({ url: url, error: 'Page Crashed..!' });
                }
            }

            return results;
        } catch (error) {
            console.error(error);

            return {
                error: `Error at AxeBuilder Analyzer..! Check the server console.`,
            };
        } finally {
            await browser.close();
        }
    }

    private parseResult(result: Awaited<ReturnType<AxeBuilder['analyze']>>) {
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
