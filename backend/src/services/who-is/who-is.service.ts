import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { xml2json } from 'xml-js';

@Injectable()
export class WhoIsService {
    private baseUrl: string =
        'https://www.whoisxmlapi.com/whoisserver/WhoisService?';

    constructor(private readonly envService: EnvService) {}
    async analyze(url: string) {
        try {
            const response = await fetch(
                this.baseUrl +
                    new URLSearchParams({
                        apiKey: this.envService.whoIsApiKey,
                        domainName: new URL(url).host,
                    }),
            );
            if (!response.ok)
                return {
                    error: `Error at WhoIs. Status:${response.status}`,
                };

            const resultAsXML = await response.text();

            return JSON.parse(xml2json(resultAsXML));
        } catch (error) {
            console.error(error);

            return {
                error: `Error at WhoIs Analzyer..! Check the server console.`,
            };
        }
    }
}
