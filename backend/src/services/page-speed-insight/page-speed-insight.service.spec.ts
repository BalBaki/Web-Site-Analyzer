import { Test, TestingModule } from '@nestjs/testing';
import { PageSpeedInsightService } from './page-speed-insight.service';

describe('PageSpeedInsightService', () => {
  let service: PageSpeedInsightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PageSpeedInsightService],
    }).compile();

    service = module.get<PageSpeedInsightService>(PageSpeedInsightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
