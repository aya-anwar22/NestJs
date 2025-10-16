import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentStageService } from './development-stage.service';

describe('DevelopmentStageService', () => {
  let service: DevelopmentStageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevelopmentStageService],
    }).compile();

    service = module.get<DevelopmentStageService>(DevelopmentStageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
