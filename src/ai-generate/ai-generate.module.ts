import { Module } from '@nestjs/common';
import { AiGenerateService } from './ai-generate.service';
import { AiGenerateController } from './ai-generate.controller';
import { AwsServiceService } from 'src/aws-service/aws-service.service';

@Module({
  controllers: [AiGenerateController],
  providers: [AiGenerateService,AwsServiceService],
})
export class AiGenerateModule {}
