import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskType } from './enum/task-type.enum';
import { TaskStatus } from './enum/task-status.enum';
import { TaskSchedulerRepository } from './repository/task-scheduler.repository';

@Processor('tasks')
export class TaskProcessor {

    constructor(private readonly taskSchedulerRepository: TaskSchedulerRepository) { }

    @Process('process-task')
    async processTask(job: Job<{ taskId: string }>) {
        const { taskId } = job.data;
        console.log("🚀 ~ TaskProcessor ~ processTask ~ taskId:", taskId)
        console.log("🚀 ~ TaskProcessor ~ processTask ~ taskId:", new Date())

        try {

            const task = await this.taskSchedulerRepository.getTask(taskId);

            switch (task.type) {

                case TaskType.EMAIL:
                    await this.processEmailTask(task);
                    break;
                case TaskType.NOTIFICATION:
                    await this.processNotificationTask(task);
                    break;
                default:
                    throw new Error(`Unsupported task type: ${task.type}`);
            }

            await this.taskSchedulerRepository.updateTaskStatus(taskId, TaskStatus.COMPLETED);

        } catch (error) {

            await this.taskSchedulerRepository.updateTaskStatus(taskId, TaskStatus.FAILED);
        }
    }

    async processEmailTask(task: any): Promise<Boolean> {
        console.log("🚀 ~ TaskProcessor ~ processEmailTask ~ task:", task)
        return true;
    }

    async processNotificationTask(task: any): Promise<Boolean> {
        console.log("🚀 ~ TaskProcessor ~ processEmailTask ~ task:", task)
        return true;
    }

}