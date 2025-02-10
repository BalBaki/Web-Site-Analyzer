import { Injectable } from '@nestjs/common';
import { AxeBuilder } from '@axe-core/playwright';
import * as playwright from 'playwright';

@Injectable()
export class AxeBuilderService {
    async analyze(url: string) {
        const browser = await playwright.chromium.launch({
            headless: true,
        });

        try {
            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto(url);

            const result = await new AxeBuilder({ page }).analyze();

            return result.incomplete
                .concat(result.violations, result.inapplicable)
                .filter((result) => result.nodes.length > 0)
                .map((result) => {
                    if (!result.impact) {
                        result = Object.assign(result, { impact: 'trivial' });
                    }

                    result.nodes.forEach((node) => {
                        node.all = node.all
                            .concat(node.any, node.none)
                            .filter((data) => data.relatedNodes.length > 0);

                        delete node.any;
                        delete node.none;
                    });

                    return result;
                });
        } catch (error) {
            console.error(error);

            return {
                error: `Error at AxeBuilder Analyzer..! Check the server console.`,
            };
        } finally {
            await browser.close();
        }
    }
}
