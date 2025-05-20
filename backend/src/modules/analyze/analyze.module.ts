import { Module } from '@nestjs/common';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';
import { WhoIsService } from './services/who-is/who-is.service';
import { AnalyzeService } from './analyze.service';
import { EnvModule } from '../env/env.module';

@Module({
    providers: [AxeBuilderService, PageSpeedInsightService, WhoIsService, AnalyzeService],
    exports: [AnalyzeService],
    imports: [EnvModule],
})
export class AnalyzeModule {}
