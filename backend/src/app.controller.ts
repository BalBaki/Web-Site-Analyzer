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
            try {
                return JSON.parse(val);
            } catch {
                throw new Error('Invalid JSON format');
            }
        })
        .pipe(z.array(z.enum(['axebuilder'])))
        .transform((val) => [...new Set(val)]),
});

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get('analyze')
    @UsePipes(new ZodValidationPipe(analyzeSchema, 'analyze'))
    analyze(
        @Query() query: z.infer<typeof analyzeSchema>,
        @Res() res: Response,
    ) {
        return res.json(query);
    }
}
