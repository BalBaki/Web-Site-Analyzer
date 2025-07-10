import type { BaseError, Result } from './common.type';

export type ScoreStatus = 'pass' | 'average' | 'fail';
export type PageSpeedInsightStatusPriorty = Record<ScoreStatus, number>;
export type PageSpeedResultsMap = Record<string, TransformedPageSpeedData>;
export type PageSpeedInsightDataError = BaseError;
export type PageSpeedInsightResult = Result<PageSpeedInsightData, PageSpeedInsightDataError>;

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

export interface Categories {
    accessibility?: LighthouseCategoryV5;
    'best-practices'?: LighthouseCategoryV5;
    performance?: LighthouseCategoryV5;
    pwa?: LighthouseCategoryV5;
    seo?: LighthouseCategoryV5;
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

export interface PageSpeedInsightData {
    desktop: PagespeedApiPagespeedResponseV5;
    mobile: PagespeedApiPagespeedResponseV5;
}

export interface TransformedPageSpeedData {
    audits: Array<{
        category: LighthouseCategoryV5;
        results: LighthouseAuditResultV5[];
    }>;
    categories: Categories;
}
