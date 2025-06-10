import type { AnalyzePayload, AsyncResult, Result } from 'src/types';

export interface AnalyzerTool {
    analyze(payload: AnalyzePayload): Result<any, string> | AsyncResult<any, string>;
}
