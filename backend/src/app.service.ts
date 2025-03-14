import { Injectable } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { InvalidPayloadException } from './exceptions/invalid-payload.exception';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';
import { WhoIsService } from './services/who-is/who-is.service';
import type { AnalyzePayload } from './types';

@Injectable()
export class AppService {
    constructor(
        private axeBuilderService: AxeBuilderService,
        private pageSpeedInsightService: PageSpeedInsightService,
        private whoIsService: WhoIsService,
    ) {}

    async analyze(payload: AnalyzePayload) {
        try {
            const analyzeResults = await Promise.all(
                payload.services.map((service) => {
                    switch (service) {
                        case 'axebuilder':
                            return this.axeBuilderService.analyze(payload.url);
                        case 'pagespeedinsight':
                            return this.pageSpeedInsightService.analyze(payload.url);
                        case 'whois':
                            return this.whoIsService.analyze(payload.url);
                        default:
                            throw new InvalidPayloadException();
                    }
                }),
            );

            return {
                analyze: true,
                result: payload.services.reduce((result, service, index) => {
                    result[service] = analyzeResults[index];

                    return result;
                }, {}),
            };
        } catch (error) {
            return { analyze: false, error: 'Something went wrong..!' };
        }
    }
}
