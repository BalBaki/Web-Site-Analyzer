import { Injectable } from '@nestjs/common';
import type { AnalyzePayload, AssistantPayload } from './types';
import { AnalyzeService } from './modules/analyze/analyze.service';
import { AssissantService } from './modules/assistant/assistant.service';

@Injectable()
export class AppService {
    constructor(
        private analyzeService: AnalyzeService,
        private assistantService: AssissantService,
    ) {}

    async analyze(payload: AnalyzePayload) {
        try {
            const analyzeResults = await Promise.all(
                payload.services.map((toolName) => this.analyzeService.getTool(toolName).analyze(payload)),
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

    async assistant(payload: AssistantPayload) {
        try {
            const result = await this.assistantService.getTool(payload.tool).ask(payload);

            return { assistant: true, answer: result };
        } catch (error) {
            console.error(error);

            return { assistant: false, error: 'Error at ChatGpt Assissant. Check Console' };
        }
    }
}
