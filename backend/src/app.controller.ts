import { Controller, Get, Query, Res, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { analyzeSchema } from './schemas';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import type { Response } from 'express';
import type { AnalyzePayload } from './types';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('analyze')
    @UsePipes(new ZodValidationPipe(analyzeSchema, 'analyze'))
    async analyze(@Query() query: AnalyzePayload, @Res() res: Response) {
        const result = await this.appService.analyze(query);

        return res.json(result);
    }
}
