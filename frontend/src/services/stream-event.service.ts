import type { ProgressStatus, StreamEvent } from '@/types';

export class StreamEventService {
    static getStatus = (event: StreamEvent): ProgressStatus => {
        if (
            event.type === 'complete' ||
            (event.type === 'service' &&
                (event.streamData.stage === 'complete_tool' ||
                    event.streamData.stage === 'link_extraction_complete' ||
                    event.streamData.stage === 'url_process_complete'))
        )
            return 'completed';

        if (event.type === 'error' || (event.type === 'service' && event.streamData.stage === 'tool_error'))
            return 'error';
        if (
            event.type === 'start' ||
            (event.type === 'service' &&
                (event.streamData.stage === 'start_tool' || event.streamData.stage === 'link_extraction'))
        )
            return 'start';

        return 'analyzing';
    };
}
