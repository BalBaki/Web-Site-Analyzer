import * as z from 'zod';
import { analyzeSchema, assistantSchema } from './schemas';
import AxeBuilder from '@axe-core/playwright';
export type AnalyzePayload = z.infer<typeof analyzeSchema>;
export type AssistantPayload = z.infer<typeof assistantSchema>;
export type AxeResult = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];
export type AxePageScanResult = { url: string } & ({ error: string } | { result: AxeResult });
