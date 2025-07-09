import * as z from 'zod';
import { analyzeSchema, assistantSchema } from './schemas';
import AxeBuilder from '@axe-core/playwright';
import { Status } from './enums';
import type { ViewportSize } from 'playwright';
import { EVENT_TYPE, TOOL_STAGE } from './constants';

// =============================================================================
// CORE UTILITY TYPES
// =============================================================================

export type Result<Ok, Err> = { status: Status.Ok; data: Ok } | { status: Status.Err; err: Err };
export type AsyncResult<Ok, Err> = Promise<Result<Ok, Err>>;
type BaseError = string;
export type Device = 'desktop' | 'tablet' | 'mobile';

// =============================================================================
// SCHEMA PAYLOAD TYPES
// =============================================================================

export type AnalyzePayload = z.infer<typeof analyzeSchema>;
export type AssistantPayload = z.infer<typeof assistantSchema>;

// =============================================================================
// ACCESSIBILITY SCAN TYPES
// =============================================================================

export type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type AxeViolation = AxeResults['violations'][number];
type NormalizedAxeViolation = Omit<AxeViolation, 'impact'> & {
    impact: NonNullable<AxeViolation['impact']> | 'trivial';
};
export type AxeViolations = NormalizedAxeViolation[];

export interface TabbableElementInfo {
    elementType: string;
    tabIndex: number;
    text: string;
    ariaLabel: string | null;
    title: string | null;
    name: string | null;
    disabled: boolean;
}

export interface HeadingElementData {
    level: string;
    text: string;
    outerHTML: string;
    srOnly: boolean;
}

export type AxePageScan = {
    violations: AxeViolations;
    headingTree: HeadingElementData[];
    tabNavigationOrder: TabbableElementInfo[];
};

export type DeviceViewport = {
    [key in Device]: ViewportSize;
};

export type ViolationImpactPriorty = Record<NonNullable<AxeViolations[number]['impact'] | 'trivial'>, number>;

export type AxePageScanError = BaseError;
export type AxePageScanResult = { url: string } & Result<AxePageScan, AxePageScanError>;
export type AxeDevice = Record<Device, AxePageScanResult[]>;
export type AxeResultError = string;
export type AxeResult = AsyncResult<AxeDevice, AxeResultError>;

// =============================================================================
// ANALYSIS & SERVICE TYPES
// =============================================================================

export type Service = AnalyzePayload['services'][number];
export type Analyze = Partial<Record<Service, any>>;
type AnalyzeError = BaseError;
export type AnalyzeResult = AsyncResult<Analyze, AnalyzeError>;

// =============================================================================
// EXTERNAL SERVICE TYPES
// =============================================================================

export type PageSpeedInsightResult = AsyncResult<any, string>;
export type WhoIsResult = AsyncResult<any, string>;

// =============================================================================
// ASSISTANT TYPES
// =============================================================================

export type Tool = AssistantPayload['tool'];

type Ask = {
    answer: string;
};

type AskError = BaseError;
export type AskResult = AsyncResult<Ask, AskError>;

// =============================================================================
// SSE TYPES
// =============================================================================

type ToolStage = typeof TOOL_STAGE;
type CommonStage = ToolStage['COMMON'];
type AxeStage = ToolStage['AXE'];

export type RawAxeBuilderStreamData =
    | {
          stage: CommonStage['START_TOOL'] | AxeStage['LINK_EXTRACTION'];
      }
    | {
          stage: AxeStage['LINK_EXTRACTION_COMPLETE'];
          urls: string[];
      }
    | {
          stage: AxeStage['URL_PROCESSING'] | AxeStage['URL_PROCESS_COMPLETE'];
          currentUrl: string;
          totalUrls: number;
          urlIndex: number;
      }
    | {
          stage: CommonStage['COMPLETE_TOOL'];
          result: Result<AxeDevice, AxeResultError>;
      }
    | {
          stage: CommonStage['TOOL_ERROR'];
          result: {
              status: Status.Err;
              err: string;
          };
      };

export type RawPageSpeedInsightStreamData =
    | {
          stage: CommonStage['START_TOOL'];
      }
    | {
          stage: CommonStage['COMPLETE_TOOL'];
          result: Result<any, string>;
      }
    | {
          stage: CommonStage['TOOL_ERROR'];
          result: {
              status: Status.Err;
              err: string;
          };
      };

export type RawWhoIsStreamData =
    | {
          stage: CommonStage['START_TOOL'];
      }
    | {
          stage: CommonStage['COMPLETE_TOOL'];
          result: Result<any, string>;
      }
    | {
          stage: CommonStage['TOOL_ERROR'];
          result: {
              status: Status.Err;
              err: string;
          };
      };

interface BaseStreamData {
    message?: string;
}

export type AxeBuilderStreamData = RawAxeBuilderStreamData & BaseStreamData;
export type PageSpeedInsightStreamData = RawPageSpeedInsightStreamData & BaseStreamData;
export type WhoIsStreamData = RawWhoIsStreamData & BaseStreamData;
export type AllStreamData = AxeBuilderStreamData | PageSpeedInsightStreamData | WhoIsStreamData;
export type EventType = typeof EVENT_TYPE;

interface BaseStreamEventData {
    message: string;
    timestamp: string;
}

export interface StreamStartEventData extends BaseStreamEventData {
    event: EventType['START'];
    totalServices: number;
}
export interface StreamCompleteEventData extends BaseStreamEventData {
    event: EventType['COMPLETE'];
    totalServices: number;
}
export interface StreamServiceEventData extends BaseStreamEventData {
    event: EventType['SERVICE'];
    service: Service;
    totalServices: number;
    serviceIndex?: number;
    streamData: AllStreamData;
}
export interface StreamErrorEventData extends BaseStreamEventData {
    event: EventType['ERROR'];
}

export interface StreamStartEvent {
    data: StreamStartEventData;
}

export interface StreamCompleteEvent {
    data: StreamCompleteEventData;
}

export interface StreamServiceEvent {
    data: StreamServiceEventData;
}

export interface StreamErrorEvent {
    data: StreamErrorEventData;
}

export type StreamEvent = StreamStartEvent | StreamCompleteEvent | StreamServiceEvent | StreamErrorEvent;
export type StreamEventData =
    | StreamStartEventData
    | StreamCompleteEventData
    | StreamServiceEventData
    | StreamErrorEventData;

export interface AnalyzeStreamMessage {
    type: EventType[keyof EventType];
    data: StreamEventData;
}
