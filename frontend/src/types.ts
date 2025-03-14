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
          };
      }
    | { analyze: false; error: string };

//AxeBuilder
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

//WhoIs
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
