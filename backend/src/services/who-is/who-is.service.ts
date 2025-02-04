import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class WhoIsService {
    private baseUrl: string = 'https://whoisjson.com/api/v1/whois?';

    constructor(private readonly envService: EnvService) {}
    async analyze(url: string) {
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
