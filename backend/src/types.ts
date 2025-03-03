import * as z from 'zod';
import { analyzeSchema } from './schemas';

export type AnalyzePayload = z.infer<typeof analyzeSchema>;
