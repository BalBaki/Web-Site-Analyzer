import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
    private readonly _pageSpeedInsightApiKey: string;
    private readonly _whoIsApiKey: string;

    constructor(private readonly configService: ConfigService) {
        const pageSpeedInsightApiKey = this.configService.get<
            string | undefined
        >('PAGE_SPEED_INSIGHT_API_KEY');
        const whoIsApiKey = this.configService.get<string | undefined>(
            'WHO_IS_API_KEY',
        );

        if (!pageSpeedInsightApiKey)
            throw new Error('Missiong PageSpeed Insight api credentials!');
        if (!whoIsApiKey) throw new Error('Missiong WhoIs api credentials!');

        this._pageSpeedInsightApiKey = pageSpeedInsightApiKey;
        this._whoIsApiKey = whoIsApiKey;
    }

    get pageSpeedInsightApiKey() {
        return this._pageSpeedInsightApiKey;
    }

    get whoIsApiKey() {
        return this._whoIsApiKey;
    }
}
