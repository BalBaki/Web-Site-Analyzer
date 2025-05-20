import type { AnalyzePayload } from 'src/types';

export interface AnalyzerTool {
    analyze(payload: AnalyzePayload): Promise<any>;
}
