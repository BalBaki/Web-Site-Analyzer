import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
    constructor(private readonly configService: ConfigService) {}

    get pageSpeedInsightApiKey() {
        return this.configService.get<string>('PAGE_SPEED_INSIGHT_API_KEY');
    }

    get whoIsApiKey() {
        return this.configService.get<string>('WHO_IS_API_KEY');
    }
}
