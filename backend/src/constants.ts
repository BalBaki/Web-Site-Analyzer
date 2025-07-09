import type { ViolationImpactPriorty } from './types';

export const VIOLATION_IMPACT_PRIORTY: ViolationImpactPriorty = {
    critical: 5,
    serious: 4,
    moderate: 3,
    minor: 2,
    trivial: 1,
};

export const EVENT_TYPE = {
    SERVICE: 'service',
    START: 'start',
    COMPLETE: 'complete',
    ERROR: 'error',
} as const;

export const TOOL_STAGE = {
    COMMON: {
        START_TOOL: 'start_tool',
        COMPLETE_TOOL: 'complete_tool',
        TOOL_ERROR: 'tool_error',
    },
    AXE: {
        LINK_EXTRACTION: 'link_extraction',
        LINK_EXTRACTION_COMPLETE: 'link_extraction_complete',
        URL_PROCESSING: 'url_processing',
        URL_PROCESS_COMPLETE: 'url_process_complete',
    },
} as const;
