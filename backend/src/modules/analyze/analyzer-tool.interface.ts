import { Observable } from 'rxjs';
import type {
    AnalyzePayload,
    AsyncResult,
    AxeBuilderStreamData,
    PageSpeedInsightStreamData,
    Result,
    WhoIsStreamData,
} from 'src/types';

export interface AnalyzerTool {
    analyze(payload: AnalyzePayload, abortController: AbortController): Result<any, string> | AsyncResult<any, string>;
    analyzeStream$?: (
        payload: AnalyzePayload,
        abortController: AbortController,
    ) => Observable<AxeBuilderStreamData | PageSpeedInsightStreamData | WhoIsStreamData>;
}
