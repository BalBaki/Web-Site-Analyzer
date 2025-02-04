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

            return result.incomplete;
        } catch (error) {
            console.log(error);
        } finally {
            await browser.close();
        }
    }
}
