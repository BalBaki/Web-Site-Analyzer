import type { AssistantPayload } from 'src/types';

export interface AssissantTool {
    ask(payload: AssistantPayload): Promise<any>;
}
