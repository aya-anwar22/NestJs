import { Test, TestingModule } from '@nestjs/testing';
import { DevelopmentStageController } from './development-stage.controller';
import { DevelopmentStageService } from './development-stage.service';

describe('DevelopmentStageController', () => {
  let controller: DevelopmentStageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopmentStageController],
      providers: [DevelopmentStageService],
    }).compile();

    controller = module.get<DevelopmentStageController>(DevelopmentStageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
