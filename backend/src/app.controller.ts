import { Controller, Get, Query, Res, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import type { Response } from 'express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import * as z from 'zod';

const analyzeSchema = z.object({
    url: z.string().url(),
    services: z
        .string()
        .transform((val) => {
            return val.split(',');
        })
        .pipe(z.array(z.enum(['axebuilder', 'pagespeedinsight', 'whois'])))
        .transform((val) => [...new Set(val)]),
});
export type AnalyzePayload = z.infer<typeof analyzeSchema>;

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
