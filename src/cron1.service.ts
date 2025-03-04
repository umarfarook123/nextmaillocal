import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class CronService {


    //Normal Way
    @Cron(CronExpression.EVERY_MINUTE)
    handleCron() {
        console.log('This message runs every minute!');
    }

    @Cron('0 0 12 * * *')
    handleCronAtNoon() {
        console.log('This message runs every day at noon!');
    }

    @Cron('*/2 * * * *')
    handleCronEveryFiveSeconds() {
        console.log('This message runs every 7 seconds');
    }

    //Dynamic Way
    private cronJobs: Map<string, CronJob> = new Map();

    startCronJob(cronPattern: string, jobName: string) {
        if (this.cronJobs.has(jobName)) {
            throw new Error(`Cron job with name ${jobName} already exists.`);

        }

        const cronJob = new CronJob(cronPattern, () => {
            console.log(`${jobName} is running at ${new Date().toISOString()}`);
        });

        this.cronJobs.set(jobName, cronJob);
        cronJob.start();
        console.log(`Cron job "${jobName}" started with pattern "${cronPattern}"`);
    }

    stopCronJob(jobName: string) {
        const cronJob = this.cronJobs.get(jobName);
        if (!cronJob) {
            throw new Error(`No cron job found with name "${jobName}"`);
        }
        cronJob.stop();
        this.cronJobs.delete(jobName);
        console.log(`Cron job "${jobName}" stopped`);
    }

    listCronJobs() {
        return Array.from(this.cronJobs.keys());
    }
}
