import * as z from 'zod';
import { analyzeSchema, assistantSchema } from './schemas';
import AxeBuilder from '@axe-core/playwright';
export type AnalyzePayload = z.infer<typeof analyzeSchema>;
export type AssistantPayload = z.infer<typeof assistantSchema>;
export type AxeResult = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

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
export type AxePageScanResult = { url: string } & (
    | { error: string }
    | { result: AxeResult; headingTree: HeadingElementData[]; tabNavigationOrder: TabbableElementInfo[] }
);
