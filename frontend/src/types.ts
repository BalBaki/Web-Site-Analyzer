/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';
import { Status } from './enums';
import { analyzeFormSchema, analyzeSearchParamsSchema, askSchema, envSchema } from './schemas';
import type { ReactNode } from 'react';

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Result<Ok, Err> = { status: Status.Ok; data: Ok } | { status: Status.Err; err: Err };
export type AsyncResult<Ok, Err> = Promise<Result<Ok, Err>>;
type BaseError = string;

export type DataType = 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' | 'unknown';

export type DataTypeWithSchema = {
    type: DataType;
    schema: Zod.ZodSchema<any>;
};

type DataTypeToTSType = {
    null: null;
    undefined: undefined;
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    array: any[];
    object: Record<string, any>;
    unknown: unknown;
};

export type DetectedDataResult<T extends DataType> = {
    type: T;
    data: DataTypeToTSType[T];
};

export type AnyDetectedDataResult = {
    [T in DataType]: DetectedDataResult<T>;
}[DataType];

export type ScoreStatus = 'pass' | 'average' | 'fail';
export type PageSpeedInsightStatusPriorty = Record<ScoreStatus, number>;

export type Device = 'desktop' | 'tablet' | 'mobile';

// =============================================================================
// ACCESSIBILITY & AXE BUILDER TYPES
// =============================================================================

export type ImpactSeverity = 'trivial' | 'minor' | 'moderate' | 'serious' | 'critical';

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

type UnlabelledFrameSelector = string[];

interface NodeResult {
    html: string;
    impact?: ImpactSeverity;
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

export type ErrorCount = Record<ImpactSeverity | 'total', number>;

export type AxePageScan = {
    violations: AccessibilityViolation[];
    headingTree: HeadingElement[];
    tabNavigationOrder: TabbableElementInfo[];
};

export type AxePageScanError = BaseError;
export type AxePageScanResult = { url: string } & Result<AxePageScan, AxePageScanError>;
export type AxeDevice = Record<Device, AxePageScanResult[]>;
export type AxeResultError = string;

// =============================================================================
// WHOIS TYPES
// =============================================================================

interface Contact {
    handle: string;
    type: string;
    name: string;
    organization: string;
    email: string;
    address: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    fax: string;
    created: string;
    changed: string;
}

export interface WhoisData {
    server: string; // example: "delta"
    name: string; // example: "whoisjson.com"
    idnName: string; // example: "whoisjson.com"
    status: string[]; // example: ["clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited"]
    nameserver?: string[]; // example: ["dns200.anycast.me"]
    ips: string; // example: "62.210.113.88"
    created: string; // example: "2016-12-01 09:28:12"
    changed: string; // example: "2021-12-02 00:13:57"
    expires: string; // example: "2022-12-01 10:28:12"
    registered: boolean; // example: true
    dnssec: string; // example: "signedDelegation"
    whoisserver: string; // example: "whois.ovh.com"
    contacts: {
        owner?: Contact[];
        admin?: Contact[];
        tech?: Contact[];
    };
    registrar: {
        id: string; // example: "433"
        name: string; // example: "OVH, SAS"
        email: string; // example: "abuse@ovh.net"
        url: string; // example: "https://www.ovh.com"
        phone: string; // example: "33.972101007"
    };
    rawdata: string[];
    network: string;
    exception: string;
    parsedContacts: boolean; // example: true
    template: Record<string, string>;
    ask_whois: string; // example: "whois.ovh.com"
}

// =============================================================================
// PAGE SPEED INSIGHT TYPES
// =============================================================================

interface AuditRefs {
    acronym?: string | null;
    group?: string | null;
    id?: string | null;
    relevantAudits?: string[] | null;
    weight?: number | null;
}

interface Bucket {
    max?: number | null;
    min?: number | null;
    proportion?: number | null;
}

export interface Categories {
    accessibility?: LighthouseCategoryV5;
    'best-practices'?: LighthouseCategoryV5;
    performance?: LighthouseCategoryV5;
    pwa?: LighthouseCategoryV5;
    seo?: LighthouseCategoryV5;
}

interface CategoryGroupV5 {
    description?: string | null;
    title?: string | null;
}

interface ConfigSettings {
    channel?: string | null;
    emulatedFormFactor?: string | null;
    formFactor?: string | null;
    locale?: string | null;
    onlyCategories?: any | null;
}

interface Environment {
    benchmarkIndex?: number | null;
    credits?: Record<string, string> | null;
    hostUserAgent?: string | null;
    networkUserAgent?: string | null;
}

interface I18n {
    rendererFormattedStrings?: RendererFormattedStrings;
}

interface LhrEntity {
    category?: string | null;
    homepage?: string | null;
    isFirstParty?: boolean | null;
    isUnrecognized?: boolean | null;
    name?: string | null;
    origins?: string[] | null;
}

export interface LighthouseAuditResultV5 {
    description?: string | null;
    details?: Record<string, any> | null;
    displayValue?: string | null;
    errorMessage?: string | null;
    explanation?: string | null;
    id?: string | null;
    metricSavings?: MetricSavings;
    numericUnit?: string | null;
    numericValue?: number | null;
    score?: any | null;
    scoreDisplayMode?: string | null;
    title?: string | null;
    warnings?: any | null;
}

export interface LighthouseCategoryV5 {
    auditRefs?: AuditRefs[];
    description?: string | null;
    id?: string | null;
    manualDescription?: string | null;
    score?: any | null;
    title?: string | null;
}

export interface LighthouseResultV5 {
    audits?: Record<string, LighthouseAuditResultV5> | null;
    categories?: Categories;
    categoryGroups?: Record<string, CategoryGroupV5> | null;
    configSettings?: ConfigSettings;
    entities?: LhrEntity[];
    environment?: Environment;
    fetchTime?: string | null;
    finalDisplayedUrl?: string | null;
    finalUrl?: string | null;
    fullPageScreenshot?: any | null;
    i18n?: I18n;
    lighthouseVersion?: string | null;
    mainDocumentUrl?: string | null;
    requestedUrl?: string | null;
    runtimeError?: RuntimeError;
    runWarnings?: any[] | null;
    stackPacks?: StackPack[];
    timing?: Timing;
    userAgent?: string | null;
}

interface MetricSavings {
    CLS?: number | null;
    FCP?: number | null;
    INP?: number | null;
    LCP?: number | null;
    TBT?: number | null;
}

interface PagespeedApiLoadingExperienceV5 {
    id?: string | null;
    initial_url?: string | null;
    metrics?: Record<string, UserPageLoadMetricV5> | null;
    origin_fallback?: boolean | null;
    overall_category?: string | null;
}

interface PagespeedVersion {
    major?: string | null;
    minor?: string | null;
}

interface RendererFormattedStrings {
    auditGroupExpandTooltip?: string | null;
    calculatorLink?: string | null;
    crcInitialNavigation?: string | null;
    crcLongestDurationLabel?: string | null;
    dropdownCopyJSON?: string | null;
    dropdownDarkTheme?: string | null;
    dropdownPrintExpanded?: string | null;
    dropdownPrintSummary?: string | null;
    dropdownSaveGist?: string | null;
    dropdownSaveHTML?: string | null;
    dropdownSaveJSON?: string | null;
    dropdownViewer?: string | null;
    errorLabel?: string | null;
    errorMissingAuditInfo?: string | null;
    footerIssue?: string | null;
    labDataTitle?: string | null;
    lsPerformanceCategoryDescription?: string | null;
    manualAuditsGroupTitle?: string | null;
    notApplicableAuditsGroupTitle?: string | null;
    opportunityResourceColumnLabel?: string | null;
    opportunitySavingsColumnLabel?: string | null;
    passedAuditsGroupTitle?: string | null;
    runtimeDesktopEmulation?: string | null;
    runtimeMobileEmulation?: string | null;
    runtimeNoEmulation?: string | null;
    runtimeSettingsAxeVersion?: string | null;
    runtimeSettingsBenchmark?: string | null;
    runtimeSettingsChannel?: string | null;
    runtimeSettingsCPUThrottling?: string | null;
    runtimeSettingsDevice?: string | null;
    runtimeSettingsFetchTime?: string | null;
    runtimeSettingsNetworkThrottling?: string | null;
    runtimeSettingsTitle?: string | null;
    runtimeSettingsUA?: string | null;
    runtimeSettingsUANetwork?: string | null;
    runtimeSettingsUrl?: string | null;
    runtimeUnknown?: string | null;
    scorescaleLabel?: string | null;
    showRelevantAudits?: string | null;
    snippetCollapseButtonLabel?: string | null;
    snippetExpandButtonLabel?: string | null;
    thirdPartyResourcesLabel?: string | null;
    throttlingProvided?: string | null;
    toplevelWarningsMessage?: string | null;
    varianceDisclaimer?: string | null;
    viewTreemapLabel?: string | null;
    warningAuditsGroupTitle?: string | null;
    warningHeader?: string | null;
}

interface RuntimeError {
    code?: string | null;
    message?: string | null;
}

interface StackPack {
    descriptions?: Record<string, string> | null;
    iconDataURL?: string | null;
    id?: string | null;
    title?: string | null;
}

interface Timing {
    total?: number | null;
}

interface UserPageLoadMetricV5 {
    category?: string | null;
    distributions?: Bucket[];
    formFactor?: string | null;
    median?: number | null;
    metricId?: string | null;
    percentile?: number | null;
}

export interface PageSpeedInsightData {
    desktop: PagespeedApiPagespeedResponseV5;
    mobile: PagespeedApiPagespeedResponseV5;
}

export interface PagespeedApiPagespeedResponseV5 {
    analysisUTCTimestamp?: string | null;
    captchaResult?: string | null;
    id?: string | null;
    kind?: string | null;
    lighthouseResult?: LighthouseResultV5;
    loadingExperience?: PagespeedApiLoadingExperienceV5;
    originLoadingExperience?: PagespeedApiLoadingExperienceV5;
    version?: PagespeedVersion;
}

export interface TransformedPageSpeedData {
    audits: Array<{
        category: LighthouseCategoryV5;
        results: LighthouseAuditResultV5[];
    }>;
    categories: Categories;
}

export type PageSpeedResultsMap = Record<string, TransformedPageSpeedData>;

// =============================================================================
// ASSISTANT-ASK TYPES
// =============================================================================
export type AskPayload = z.infer<typeof askSchema>;

type Ask = {
    answer: string;
};

type AskError = BaseError;

// =============================================================================
// RENDER & CONFIG TYPES
// =============================================================================

export type RenderConfig = {
    name: string;
    key: string;
    render: (value: any, index?: number) => ReactNode;
    container?: (children: ReactNode) => ReactNode;
    childConfigs?: RenderConfig[];
};

export type SimpleRenderConfig = Omit<RenderConfig, 'render' | 'childConfigs'> & {
    isLink?: boolean;
    childConfigs?: SimpleRenderConfig[];
};

// =============================================================================
// ANALYZE & RESPONSE TYPES
// =============================================================================

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;

export type AxeResult = Result<AxeDevice, AxeResultError>;
export type WhoIsResult = Result<WhoisData, string>;
export type PageSpeedInsightResult = Result<PageSpeedInsightData, string>;
export type AskResult = AsyncResult<Ask, AskError>;

export type AnalyzeResult = AsyncResult<
    Partial<{
        axebuilder: AxeResult;
        whois: WhoIsResult;
        pagespeedinsight: PageSpeedInsightResult;
    }>,
    string
>;

// =============================================================================
// ENVIRONMENT TYPES
// =============================================================================

export type Env = z.infer<typeof envSchema>;
