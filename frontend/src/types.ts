import * as z from 'zod';
import { analyzeSearchParamsSchema } from './schemas';
import { analyzeFormSchema } from './schemas';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;
