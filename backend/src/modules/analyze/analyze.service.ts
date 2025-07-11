import { Injectable } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';
import { WhoIsService } from './services/who-is/who-is.service';
import { AnalyzePayload, Service, StreamEvent, StreamServiceEvent } from 'src/types';
import { InvalidPayloadException } from 'src/exceptions/invalid-payload.exception';
import { catchError, concat, defer, from, fromEvent, map, Observable, of, startWith, takeUntil } from 'rxjs';
import { Status } from 'src/enums';
import { EVENT_TYPE, TOOL_STAGE } from 'src/constants';

@Injectable()
export class AnalyzeService {
    constructor(
        private axeBuilderService: AxeBuilderService,
        private pageSpeedInsightService: PageSpeedInsightService,
        private whoIsService: WhoIsService,
    ) {}

    getTool(toolName: Service) {
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

    private createToolStart$(serviceName: Service, payload: AnalyzePayload) {
        return of<StreamServiceEvent>({
            data: {
                service: serviceName,
                totalServices: payload.services.length,
                type: EVENT_TYPE.SERVICE,
                message: `Started ${serviceName} analysis`,
                timestamp: new Date().toISOString(),
                streamData: {
                    stage: TOOL_STAGE.COMMON.START_TOOL,
                },
            },
        });
    }

    private createToolError$(serviceName: Service, payload: AnalyzePayload, err: any) {
        return of<StreamServiceEvent>({
            data: {
                type: EVENT_TYPE.SERVICE,
                service: serviceName,
                totalServices: payload.services.length,
                message: `${serviceName} analysis failed`,
                streamData: {
                    stage: TOOL_STAGE.COMMON.TOOL_ERROR,
                    result: {
                        status: Status.Err,
                        err: err.message || `${serviceName} analysis failed`,
                    },
                },
                timestamp: new Date().toISOString(),
            },
        });
    }

    getStreamingAnalysis$(
        serviceName: Service,
        payload: AnalyzePayload,
        abortController: AbortController,
    ): Observable<StreamEvent> {
        const tool = this.getTool(serviceName);
        const isStreamingTool = 'analyzeStream$' in tool && typeof tool.analyzeStream$ === 'function';

        return defer(() => {
            if (isStreamingTool) {
                return tool.analyzeStream$(payload, abortController).pipe(
                    startWith({
                        message: `Started ${serviceName} analysis`,
                        stage: TOOL_STAGE.COMMON.START_TOOL,
                    }),
                    map(({ message, ...rest }) => ({
                        data: {
                            service: serviceName,
                            totalServices: payload.services.length,
                            message,
                            timestamp: new Date().toISOString(),
                            type: EVENT_TYPE.SERVICE,
                            streamData: rest,
                        },
                    })),
                    takeUntil(fromEvent(abortController.signal, 'abort')),
                    catchError((err) => this.createToolError$(serviceName, payload, err)),
                );
            }

            const start$ = this.createToolStart$(serviceName, payload);
            const result$ = from(tool.analyze(payload, abortController)).pipe(
                map((result) => ({
                    data: {
                        service: serviceName,
                        totalServices: payload.services.length,
                        message: `${serviceName} analysis completed`,
                        type: EVENT_TYPE.SERVICE,
                        timestamp: new Date().toISOString(),
                        streamData: {
                            stage: TOOL_STAGE.COMMON.COMPLETE_TOOL,
                            result,
                        },
                    },
                })),
                catchError((err) => this.createToolError$(serviceName, payload, err)),
            );

            return concat(start$, result$).pipe(takeUntil(fromEvent(abortController.signal, 'abort')));
        });
    }
}
