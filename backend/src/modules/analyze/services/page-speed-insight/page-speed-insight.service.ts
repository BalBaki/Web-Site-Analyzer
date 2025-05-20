import { Injectable } from '@nestjs/common';
import { EnvService } from '../../../env/env.service';
import { AnalyzerTool } from '../../analyzer-tool.interface';
import type { AnalyzePayload } from 'src/types';

@Injectable()
export class PageSpeedInsightService implements AnalyzerTool {
    private baseUrl: string = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?';
    private categories = ['ACCESSIBILITY', 'BEST_PRACTICES', 'PERFORMANCE', 'SEO'];
    private strategies = ['desktop', 'mobile'];

    constructor(private readonly envService: EnvService) {}

    async analyze({ url }: AnalyzePayload) {
        try {
            const searchParams = new URLSearchParams({
                key: this.envService.pageSpeedInsightApiKey,
                url,
            });
            this.categories.forEach((category) => searchParams.append('category', category));

            const responses = await Promise.all(
                this.strategies.map((strategy) => {
                    searchParams.set('strategy', strategy.toLocaleLowerCase());

                    return fetch(this.baseUrl + searchParams);
                }),
            );

            if (responses.find((res) => !res.ok))
                return {
                    error: `Error at PageSpeed Insight.`,
                };

            const results = await Promise.all(responses.map((response) => response.json()));

            return this.strategies.reduce((result, strategy, index) => {
                result[strategy] = results[index];

                return result;
            }, {});
        } catch (error) {
            console.error(error);

            return {
                error: `Error at PageSpeed Insight Analzyer..! Check the server console.`,
            };
        }
    }
}
