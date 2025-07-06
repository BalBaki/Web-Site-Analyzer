/* eslint-disable @typescript-eslint/no-explicit-any */

import type { BaseError, Device, Result } from './common.type';

export type ImpactSeverity = 'trivial' | 'minor' | 'moderate' | 'serious' | 'critical';
export type ErrorCount = Record<ImpactSeverity | 'total', number>;

type UnlabelledFrameSelector = string[];
interface CheckResult {
    id: string;
    impact: string;
    message: string;
    data: any;
    relatedNodes?: RelatedNode[];
}

interface RelatedNode {
    html: string;
    target: UnlabelledFrameSelector;
    xpath?: string[];
    ancestry?: UnlabelledFrameSelector;
    element?: HTMLElement;
}

interface NodeResult {
    html: string;
    impact: ImpactSeverity;
    target: UnlabelledFrameSelector;
    xpath?: string[];
    ancestry?: UnlabelledFrameSelector;
    all: CheckResult[];
    failureSummary?: string;
    element?: HTMLElement;
}

interface HeadingElement {
    level: string;
    text: string;
    outerHTML: string;
    srOnly: boolean;
}

export interface TabbableElementInfo {
    elementType: string;
    tabIndex: number;
    text: string;
    ariaLabel: string | null;
    title: string | null;
    name: string | null;
    disabled: boolean;
}

export interface AccessibilityViolation {
    description: string;
    help: string;
    helpUrl: string;
    id: string;
    impact: ImpactSeverity;
    tags: string[];
    nodes: NodeResult[];
}

export type AxePageScan = {
    violations: AccessibilityViolation[];
    headingTree: HeadingElement[];
    tabNavigationOrder: TabbableElementInfo[];
};

export type AxePageScanError = BaseError;
export type AxePageScanResult = { url: string } & Result<AxePageScan, AxePageScanError>;
export type AxeDevice = Record<Device, AxePageScanResult[]>;
export type AxeResultError = string;
export type AxeResult = Result<AxeDevice, AxeResultError>;
