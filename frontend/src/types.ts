/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';
import { analyzeSearchParamsSchema } from './schemas';
import { analyzeFormSchema } from './schemas';

export type AnalyzeSearchParams = z.infer<typeof analyzeSearchParamsSchema>;
export type AnalyzeFormData = z.infer<typeof analyzeFormSchema>;
export type AnalyzeResult =
    | {
          analyze: true;
          result: {
              axebuilder?: Result[];
              whois?: WhoisResult;
              pagespeedinsight?: PageSpeedInsightResult;
          };
      }
    | { analyze: false; error: string };

//AxeBuilder Start
export type ImpactValue = 'trivial' | 'minor' | 'moderate' | 'serious' | 'critical';

interface NodeResult {
    html: string;
    impact?: ImpactValue;
    target: UnlabelledFrameSelector;
    xpath?: string[];
    ancestry?: UnlabelledFrameSelector;
    all: CheckResult[];
    failureSummary?: string;
    element?: HTMLElement;
}

interface CheckResult {
    id: string;
    impact: string;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export interface Result {
    description: string;
    help: string;
    helpUrl: string;
    id: string;
    impact: ImpactValue;
    tags: string[];
    nodes: NodeResult[];
}
//AxeBuilder End

//WhoIs Start
export interface WhoisResult {
    server: string; // example: "delta"
    name: string; // example: "whoisjson.com"
    idnName: string; // example: "whoisjson.com"
    status: string[]; // example: ["clientDeleteProhibited https://icann.org/epp#clientDeleteProhibited"]
    nameserver: string[]; // example: ["dns200.anycast.me"]
    ips: string; // example: "62.210.113.88"
    created: string; // example: "2016-12-01 09:28:12"
    changed: string; // example: "2021-12-02 00:13:57"
    expires: string; // example: "2022-12-01 10:28:12"
    registered: boolean; // example: true
    dnssec: string; // example: "signedDelegation"
    whoisserver: string; // example: "whois.ovh.com"
    contacts: {
        owner: Contact[];
        admin: Contact[];
        tech: Contact[];
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
//WhoIs End

//Page Speed Insight Start
export interface PageSpeedInsightResult {
    desktop: PagespeedApiPagespeedResponseV5;
    mobile: PagespeedApiPagespeedResponseV5;
}

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

interface Categories {
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
    credits?: { [key: string]: string } | null;
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

interface LighthouseAuditResultV5 {
    description?: string | null;
    details?: { [key: string]: any } | null;
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

interface LighthouseCategoryV5 {
    auditRefs?: AuditRefs[];
    description?: string | null;
    id?: string | null;
    manualDescription?: string | null;
    score?: any | null;
    title?: string | null;
}

interface LighthouseResultV5 {
    audits?: { [key: string]: LighthouseAuditResultV5 } | null;
    categories?: Categories;
    categoryGroups?: { [key: string]: CategoryGroupV5 } | null;
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
    metrics?: { [key: string]: UserPageLoadMetricV5 } | null;
    origin_fallback?: boolean | null;
    overall_category?: string | null;
}

interface PagespeedApiPagespeedResponseV5 {
    analysisUTCTimestamp?: string | null;
    captchaResult?: string | null;
    id?: string | null;
    kind?: string | null;
    lighthouseResult?: LighthouseResultV5;
    loadingExperience?: PagespeedApiLoadingExperienceV5;
    originLoadingExperience?: PagespeedApiLoadingExperienceV5;
    version?: PagespeedVersion;
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
    descriptions?: { [key: string]: string } | null;
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
//Page Speed Insight End
