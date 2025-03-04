import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { CronService } from './cron.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('cron-jobs')
export class CronJobController {
  constructor(private readonly cronJobService: CronService) { }


  @ApiBody({
    schema: {
      properties: {
        cronPattern: { type: 'string', example: '*/1 * * * *' },
        jobName: { type: 'string', example: 'job1' },
      },
    },
  })
  @Post('start')
  startCronJob(
    @Body() body: { cronPattern: string; jobName: string },
  ): string {
    try {
      this.cronJobService.startCronJob(body.cronPattern, body.jobName);
      return `Cron job "${body.jobName}" started successfully.`;
    } catch (error) {
      return `Error starting cron job: ${error.message}`;
    }
  }



  @Delete('stop/:jobName')
  stopCronJob(@Param('jobName') jobName: string): string {
    try {
      this.cronJobService.stopCronJob(jobName);
      return `Cron job "${jobName}" stopped successfully.`;
    } catch (error) {
      return `Error stopping cron job: ${error.message}`;
    }
  }

  @Post('list')
  listCronJobs(): string[] {
    return this.cronJobService.listCronJobs();
  }

}