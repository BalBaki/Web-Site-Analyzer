import { Injectable } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import type { AnalyzePayload } from './app.controller';
import { InvalidPayloadException } from './exceptions/invalid-payload.exception';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';

@Injectable()
export class AppService {
    constructor(
        private axeBuilderService: AxeBuilderService,
        private pageSpeedInsightService: PageSpeedInsightService,
    ) {}

    async analyze(payload: AnalyzePayload) {
        try {
            const analyzeResults = await Promise.all(
                payload.services.map((service) => {
                    switch (service) {
                        case 'axebuilder':
                            return this.axeBuilderService.analyze(payload.url);
                        case 'pagespeedinsight':
                            return this.pageSpeedInsightService.analyze(
                                payload.url,
                            );
                        default:
                            throw new InvalidPayloadException();
                    }
                }),
            );

            return {
                analyze: true,
                results: payload.services.reduce((results, service, index) => {
                    results[service] = analyzeResults[index];

                    return results;
                }, {}),
            };
        } catch (error) {
            return { analyze: false, error: 'Something went wrong..!' };
        }
    }
}
