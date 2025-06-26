import type { BaseError, Result } from './common.type';

export type WhoisDataError = BaseError;
export type WhoIsResult = Result<WhoisData, WhoisDataError>;

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
    server: string;
    name: string;
    idnName: string;
    status: string[];
    nameserver?: string[];
    ips: string;
    created: string;
    changed: string;
    expires: string;
    registered: boolean;
    dnssec: string;
    whoisserver: string;
    contacts: {
        owner?: Contact[];
        admin?: Contact[];
        tech?: Contact[];
    };
    registrar: {
        id: string;
        name: string;
        email: string;
        url: string;
        phone: string;
    };
    rawdata: string[];
    network: string;
    exception: string;
    parsedContacts: boolean;
    template: Record<string, string>;
    ask_whois: string;
}
