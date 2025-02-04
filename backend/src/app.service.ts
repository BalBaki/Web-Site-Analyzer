import { Injectable } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import type { AnalyzePayload } from './app.controller';
import { InvalidPayloadException } from './exceptions/invalid-payload.exception';

@Injectable()
export class AppService {
    constructor(private axeBuilderService: AxeBuilderService) {}

    async analyze(payload: AnalyzePayload) {
        const analyzeResults = await Promise.all(
            payload.services.map((service) => {
                switch (service) {
                    case 'axebuilder':
                        return this.axeBuilderService.analyze(payload.url);
                    default:
                        throw new InvalidPayloadException();
                }
            }),
        );

        return payload.services.reduce((results, service, index) => {
            results[service] = analyzeResults[index];

            return results;
        }, {});
    }
}
