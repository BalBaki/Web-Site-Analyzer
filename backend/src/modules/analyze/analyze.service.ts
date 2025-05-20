import { Injectable } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';
import { WhoIsService } from './services/who-is/who-is.service';
import { AnalyzePayload } from 'src/types';
import { InvalidPayloadException } from 'src/exceptions/invalid-payload.exception';

@Injectable()
export class AnalyzeService {
    constructor(
        private axeBuilderService: AxeBuilderService,
        private pageSpeedInsightService: PageSpeedInsightService,
        private whoIsService: WhoIsService,
    ) {}

    getTool(toolName: AnalyzePayload['services'][number]) {
        switch (toolName) {
            case 'axebuilder':
                return this.axeBuilderService;
            case 'pagespeedinsight':
                return this.pageSpeedInsightService;
            case 'whois':
                return this.whoIsService;
            default:
                throw new InvalidPayloadException();
        }
    }
}
