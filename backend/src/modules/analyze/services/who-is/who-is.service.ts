import { Injectable } from '@nestjs/common';
import { EnvService } from '../../../env/env.service';
import { AnalyzerTool } from '../../analyzer-tool.interface';
import { Status } from 'src/enums';
import type { AnalyzePayload, WhoIsResult } from 'src/types';

@Injectable()
export class WhoIsService implements AnalyzerTool {
    private baseUrl: string = 'https://whoisjson.com/api/v1/whois?';

    constructor(private readonly envService: EnvService) {}

    // TODO : Fix "any" return type
    async analyze({ url }: AnalyzePayload, abortController: AbortController): WhoIsResult {
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
                    signal: abortController.signal,
                },
            );

            if (!response.ok)
                return {
                    status: Status.Err,
                    err: `Error at WhoIs. Status:${response.status}`,
                };

            return {
                status: Status.Ok,
                data: await response.json(),
            };
        } catch (error) {
            console.error(error);

            return {
                status: Status.Err,
                err: `Error at WhoIs Analzyer..! Check the server console.`,
            };
        }
    }
}
