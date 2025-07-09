import { Body, Controller, Get, Post, Query, Req, Res, Sse, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { analyzeSchema, assistantSchema } from './schemas';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import type { Request, Response } from 'express';
import type { AnalyzePayload, AnalyzeStreamMessage, AssistantPayload, StreamEvent } from './types';
import { map, Observable } from 'rxjs';
import { EVENT_TYPE } from './constants';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('analyze')
    @UsePipes(new ZodValidationPipe(analyzeSchema))
    async analyze(@Query() query: AnalyzePayload, @Req() request: Request, @Res() res: Response) {
        const abortController = new AbortController();

        request.on('close', () => {
            abortController.abort();
        });

        return res.json(await this.appService.analyze(query, abortController));
    }

    @Post('assistant')
    @UsePipes(new ZodValidationPipe(assistantSchema))
    async assistant(@Body() body: AssistantPayload, @Res() res: Response) {
        return res.json(await this.appService.assistant(body));
    }

    @Sse('analyze-stream')
    @UsePipes(new ZodValidationPipe(analyzeSchema))
    analyzeStream$(@Query() query: AnalyzePayload, @Req() request: Request): Observable<AnalyzeStreamMessage> {
        const abortController = new AbortController();

        request.on('close', () => {
            abortController.abort();
        });

        return this.appService.analyzeStream$(query, abortController).pipe(
            map((event) => ({
                data: event.data,
                type: event.data.event || EVENT_TYPE.SERVICE,
            })),
        );
    }
}
