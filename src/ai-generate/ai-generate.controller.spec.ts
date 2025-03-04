import { Test, TestingModule } from '@nestjs/testing';
import { AiGenerateController } from './ai-generate.controller';
import { AiGenerateService } from './ai-generate.service';

describe('AiGenerateController', () => {
  let controller: AiGenerateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiGenerateController],
      providers: [AiGenerateService],
    }).compile();

    controller = module.get<AiGenerateController>(AiGenerateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
