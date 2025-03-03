import * as z from 'zod';
import { analyzeSearchParamsSchema } from './schemas';
import { analyzeFormSchema } from './schemas';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;

export type ImpactValue = 'trivial' | 'minor' | 'moderate' | 'serious' | 'critical';

interface NodeResult {
    html: string;
    impact?: ImpactValue;
    target: UnlabelledFrameSelector;
    xpath?: string[];
    ancestry?: UnlabelledFrameSelector;
    all: CheckResult[];
    failureSummary?: string;
    element?: HTMLElement;
}

interface CheckResult {
    id: string;
    impact: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    relatedNodes?: RelatedNode[];
}

interface RelatedNode {
    html: string;
    target: UnlabelledFrameSelector;
    xpath?: string[];
    ancestry?: UnlabelledFrameSelector;
    element?: HTMLElement;
}

type UnlabelledFrameSelector = string[];

export interface Result {
    description: string;
    help: string;
    helpUrl: string;
    id: string;
    impact: ImpactValue;
    tags: string[];
    nodes: NodeResult[];
}

export type AnalyzeResult =
    | {
          analyze: true;
          results: {
              axebuilder?: Result[];
          };
      }
    | { analyze: false; error: string };
