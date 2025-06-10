import { Injectable } from '@nestjs/common';
import { AnalyzeService } from './modules/analyze/analyze.service';
import { AssissantService } from './modules/assistant/assistant.service';
import { Status } from './enums';
import type { Analyze, AskResult, AnalyzePayload, AnalyzeResult, AssistantPayload } from './types';

@Injectable()
export class AppService {
    constructor(
        private analyzeService: AnalyzeService,
        private assistantService: AssissantService,
    ) {}

    async analyze(payload: AnalyzePayload): AnalyzeResult {
        try {
            const analyzeResults = await Promise.all(
                payload.services.map((toolName) => this.analyzeService.getTool(toolName).analyze(payload)),
            );

            return {
                status: Status.Ok,
                data: payload.services.reduce((result: Analyze, service, index) => {
                    result[service] = analyzeResults[index];

                    return result;
                }, {}),
            };
        } catch (error) {
            return { status: Status.Err, err: 'Something went wrong..!' };
        }
    }

    async assistant(payload: AssistantPayload): AskResult {
        try {
            return await this.assistantService.getTool(payload.tool).ask(payload);
        } catch (error) {
            console.error(error);

            return { status: Status.Err, err: 'Something went wrong..!' };
        }
    }
}
