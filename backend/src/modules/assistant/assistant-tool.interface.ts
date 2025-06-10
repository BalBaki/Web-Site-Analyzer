import type { AskResult, AssistantPayload } from 'src/types';

export interface AssissantTool {
    ask(payload: AssistantPayload): AskResult;
}
