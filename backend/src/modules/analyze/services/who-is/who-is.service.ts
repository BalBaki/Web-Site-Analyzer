import { Injectable } from '@nestjs/common';
import { EnvService } from '../../../env/env.service';
import { AnalyzerTool } from '../../analyzer-tool.interface';
import type { AnalyzePayload } from 'src/types';

@Injectable()
export class WhoIsService implements AnalyzerTool {
    private baseUrl: string = 'https://whoisjson.com/api/v1/whois?';

    constructor(private readonly envService: EnvService) {}
    async analyze({ url }: AnalyzePayload) {
        try {
            const response = await fetch(
                this.baseUrl +
                    new URLSearchParams({
                        domain: new URL(url).host,
                    }),
                {
                    headers: new Headers({
                        Authorization: `TOKEN=${this.envService.whoIsApiKey}`,
                    }),
                    method: 'GET',
                },
            );

            if (!response.ok)
                return {
                    error: `Error at WhoIs. Status:${response.status}`,
                };

            const result = await response.json();

            return result;
        } catch (error) {
            console.error(error);

            return {
                error: `Error at WhoIs Analzyer..! Check the server console.`,
            };
        }
    }
}
