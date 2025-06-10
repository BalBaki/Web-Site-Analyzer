import * as z from 'zod';
import { analyzeSchema, assistantSchema } from './schemas';
import AxeBuilder from '@axe-core/playwright';
import { Status } from './enums';

// =============================================================================
// CORE UTILITY TYPES
// =============================================================================

export type Result<Ok, Err> = { status: Status.Ok; data: Ok } | { status: Status.Err; err: Err };
export type AsyncResult<Ok, Err> = Promise<Result<Ok, Err>>;
type BaseError = string;

// =============================================================================
// SCHEMA PAYLOAD TYPES
// =============================================================================

export type AnalyzePayload = z.infer<typeof analyzeSchema>;
export type AssistantPayload = z.infer<typeof assistantSchema>;

// =============================================================================
// ACCESSIBILITY SCAN TYPES
// =============================================================================

export type AxeViolations = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

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
    result: AxeViolations;
    headingTree: HeadingElementData[];
    tabNavigationOrder: TabbableElementInfo[];
};

export type AxePageScanError = BaseError;
export type AxePageScanResult = { url: string } & Result<AxePageScan, AxePageScanError>;
export type AxeResultError = string;
export type AxeResult = AsyncResult<AxePageScanResult[], AxeResultError>;

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
