import { Body, Controller, Get, Post, Query, Res, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { analyzeSchema, assistantSchema } from './schemas';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import type { Response } from 'express';
import type { AnalyzePayload, AssistantPayload } from './types';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('analyze')
    @UsePipes(new ZodValidationPipe(analyzeSchema, 'analyze'))
    async analyze(@Query() query: AnalyzePayload, @Res() res: Response) {
        const result = await this.appService.analyze(query);

        return res.json(result);
    }

    @Post('assistant')
    @UsePipes(new ZodValidationPipe(assistantSchema, 'assistant'))
    async assistant(@Body() body: AssistantPayload, @Res() res: Response) {
        return res.json(await this.appService.assistant(body));
    }
}
