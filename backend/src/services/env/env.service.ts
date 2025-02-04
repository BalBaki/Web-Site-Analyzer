import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
    private readonly _pageSpeedInsightApiKey: string;

    constructor(private readonly configService: ConfigService) {
        const pageSpeedInsightApiKey = this.configService.get<
            string | undefined
        >('PAGE_SPEED_INSIGHT_API_KEY');

        if (!pageSpeedInsightApiKey)
            throw new Error('Missiong PageSpeed Insight api credentials!');

        this._pageSpeedInsightApiKey = pageSpeedInsightApiKey;
    }

    get pageSpeedInsightApiKey() {
        return this._pageSpeedInsightApiKey;
    }
}
