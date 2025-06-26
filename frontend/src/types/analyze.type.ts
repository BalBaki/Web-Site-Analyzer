import * as z from 'zod';
import { analyzeFormSchema, analyzeSearchParamsSchema } from '@/schemas';
import type { AxeResult } from './axe-builder.type';
import type { AsyncResult, BaseError } from './common.type';
import type { PageSpeedInsightResult } from './page-speed-insight.type';
import type { WhoIsResult } from './who-is.type';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;

export type Analyze = Partial<{
    axebuilder: AxeResult;
    whois: WhoIsResult;
    pagespeedinsight: PageSpeedInsightResult;
}>;
export type AnalyzeError = BaseError;

export type AnalyzeResult = AsyncResult<Analyze, AnalyzeError>;
