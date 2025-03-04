import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { CronJobController } from './cron.controller';

@Module({
  controllers: [CronJobController],
  providers: [CronService],
})
export class CronModule {}
