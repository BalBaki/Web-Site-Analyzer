import * as z from 'zod';
import { Status } from '@/enums';
import { analyzeFormSchema, analyzeSearchParamsSchema } from '@/schemas';
import type { AxeResult } from './axe-builder.type';
import type { AsyncResult, BaseError } from './common.type';
import type { PageSpeedInsightResult } from './page-speed-insight.type';
import type { WhoIsResult } from './who-is.type';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;

export type Analyze = Partial<{
    axebuilder: AxeResult;
    whois: WhoIsResult;
    pagespeedinsight: PageSpeedInsightResult;
}>;
export type AnalyzeError = BaseError;

export type AnalyzeResult = AsyncResult<Analyze, AnalyzeError>;

// =============================================================================
// STREAMING
// =============================================================================

export type RawAxeBuilderStreamData =
    | {
          stage: 'start_tool' | 'link_extraction';
      }
    | {
          stage: 'link_extraction_complete';
          urls: string[];
      }
    | {
          stage: 'url_processing' | 'url_process_complete';
          currentUrl: string;
          totalUrls: number;
          urlIndex: number;
      }
    | {
          stage: 'complete_tool';
          result: AxeResult;
      }
    | {
          stage: 'tool_error';
          result: {
              status: Status.Err;
              err: string;
          };
      };

export type RawPageSpeedInsightStreamData =
    | {
          stage: 'start_tool';
      }
    | {
          stage: 'complete_tool';
          result: PageSpeedInsightResult;
      }
    | {
          stage: 'tool_error';
          result: {
              status: Status.Err;
              err: string;
          };
      };

export type RawWhoIsStreamData =
    | {
          stage: 'start_tool';
      }
    | {
          stage: 'complete_tool';
          result: WhoIsResult;
      }
    | {
          stage: 'tool_error';
          result: {
              status: Status.Err;
              err: string;
          };
      };

interface BaseStreamData {
    message: string;
}

export type AxeBuilderStreamData = RawAxeBuilderStreamData & BaseStreamData;
export type PageSpeedInsightStreamData = RawPageSpeedInsightStreamData & BaseStreamData;
export type WhoIsStreamData = RawWhoIsStreamData & BaseStreamData;
export type AllStreamData = AxeBuilderStreamData | PageSpeedInsightStreamData | WhoIsStreamData;
export type StreamEvent = StartOrCompleteEvent | ErrorEvent | ServiceEvent;

export type StartOrCompleteEvent = {
    event: 'start' | 'complete';
    message: string;
    service: AnalyzeFormData['services'];
    timestamp: string;
    totalServices: number;
    serviceIndex?: number;
};

export type ErrorEvent = {
    event: 'error';
    message: string;
    timestamp: string;
};

export type ServiceEvent = {
    event: 'service';
    message: string;
    service: AnalyzeFormData['services'][number];
    timestamp: string;
    totalServices: number;
    serviceIndex?: number;
    streamData: AllStreamData;
};
