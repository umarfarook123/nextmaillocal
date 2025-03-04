import { Injectable } from '@nestjs/common';
import { TaskSchedulerRepository } from './repository/task-scheduler.repository';
import { TaskScheduler } from './entities/task-scheduler.entity';
import { CreateTaskSchedulerDto } from './dto/task-scheduler.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TaskSchedulerService {

  constructor(
    private readonly taskSchedulerRepository: TaskSchedulerRepository,
    @InjectQueue('tasks')
    private taskQueue: Queue,
  ) { }

  async scheduleTask(createTaskDto: CreateTaskSchedulerDto): Promise<TaskScheduler> {

    const task = await this.taskSchedulerRepository.scheduleTask(createTaskDto);

    const delay = new Date(createTaskDto.scheduledTime).getTime() - Date.now();

    await this.taskQueue.add('process-task', { taskId: task.id }, { delay: Math.max(0, delay) });

    return task;
  }

  async getTasks(): Promise<TaskScheduler[]> {

    return await this.taskSchedulerRepository.getTasks();
  }

  
}
