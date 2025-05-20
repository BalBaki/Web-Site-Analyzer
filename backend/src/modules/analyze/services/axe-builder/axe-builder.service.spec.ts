import { Test, TestingModule } from '@nestjs/testing';
import { AxeBuilderService } from './axe-builder.service';

describe('AxeBuilderService', () => {
  let service: AxeBuilderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AxeBuilderService],
    }).compile();

    service = module.get<AxeBuilderService>(AxeBuilderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
