import { Test, TestingModule } from '@nestjs/testing';
import { WhoIsService } from './who-is.service';

describe('WhoIsService', () => {
  let service: WhoIsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhoIsService],
    }).compile();

    service = module.get<WhoIsService>(WhoIsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
