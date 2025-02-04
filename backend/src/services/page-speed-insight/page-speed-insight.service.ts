import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class PageSpeedInsightService {
    baseUrl: string =
        'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?';

    constructor(private readonly envService: EnvService) {}
    async analyze(url: string) {
        try {
            const response = await fetch(
                this.baseUrl +
                    new URLSearchParams({
                        key: this.envService.pageSpeedInsightApiKey,
                        url,
                    }),
            );

            if (!response.ok)
                return {
                    error: `Error at PageSpeed Insight. Status:${response.status}`,
                };

            const result = await response.json();

            return result;
        } catch (error) {
            console.error(error);

            return {
                error: `Error at PageSpeed Insight Analzyer..! Check the server console.`,
            };
        }
    }
}
