import * as z from 'zod';
import { analyzeSearchParamsSchema } from './schemas';
import { analyzeFormSchema } from './schemas';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;

type ImpactValue = 'minor' | 'moderate' | 'serious' | 'critical' | null;
type TagValue = string;

interface Result {
    description: string;
    help: string;
    helpUrl: string;
    id: string;
    impact?: ImpactValue;
    tags: TagValue[];
    // nodes: NodeResult[];
}

export type AnalyzeResult =
    | {
          analyze: true;
          results: {
              axebuilder: Result[];
          };
      }
    | { analyze: false; error: string };
