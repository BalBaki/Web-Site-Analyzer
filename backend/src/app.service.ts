import { Injectable } from '@nestjs/common';
import { AnalyzeService } from './modules/analyze/analyze.service';
import { AssissantService } from './modules/assistant/assistant.service';
import { Status } from './enums';
import {
    type Analyze,
    type AskResult,
    type AnalyzePayload,
    type AnalyzeResult,
    type AssistantPayload,
    type StreamEvent,
    StreamStartEvent,
    StreamCompleteEvent,
} from './types';
import { Observable, of, catchError, from, mergeMap, concat, takeUntil, fromEvent } from 'rxjs';
import { EVENT_TYPE } from './constants';

@Injectable()
export class AppService {
    constructor(
        private analyzeService: AnalyzeService,
        private assistantService: AssissantService,
    ) {}

    async analyze(payload: AnalyzePayload, abortController: AbortController): AnalyzeResult {
        try {
            const analyzeResults = await Promise.all(
                payload.services.map((toolName) =>
                    this.analyzeService.getTool(toolName).analyze(payload, abortController),
                ),
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

    analyzeStream$(payload: AnalyzePayload, abortController: AbortController): Observable<StreamEvent> {
        const start$ = of<StreamStartEvent>({
            data: {
                type: EVENT_TYPE.START,
                message: 'Analysis started',
                timestamp: new Date().toISOString(),
                totalServices: payload.services.length,
            },
        });
        const serviceStreams$ = payload.services.map((serviceName) => {
            return this.analyzeService.getStreamingAnalysis$(serviceName, payload, abortController);
        });
        const mergedServices$ = from(serviceStreams$).pipe(mergeMap((service$) => service$, 1));
        const end$ = of<StreamCompleteEvent>({
            data: {
                type: EVENT_TYPE.COMPLETE,
                message: 'All services analysis completed',
                timestamp: new Date().toISOString(),
                totalServices: payload.services.length,
            },
        });

        return concat(start$, mergedServices$, end$).pipe(
            takeUntil(fromEvent(abortController.signal, 'abort')),
            catchError(() =>
                of({
                    data: {
                        type: EVENT_TYPE.ERROR,
                        message: 'Analysis failed',
                        timestamp: new Date().toISOString(),
                    },
                }),
            ),
        );
    }
}
