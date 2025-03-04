import { Module } from '@nestjs/common';
import { AwsServiceService } from './aws-service.service';
import { AwsServiceController } from './aws-service.controller';

@Module({
  controllers: [AwsServiceController],
  providers: [AwsServiceService],
  exports: [AwsServiceService]

})
export class AwsServiceModule { }
