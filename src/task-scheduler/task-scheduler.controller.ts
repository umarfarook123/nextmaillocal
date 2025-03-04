import { Controller, Post, Body, Get } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { CreateTaskSchedulerDto } from './dto/task-scheduler.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskScheduler } from './entities/task-scheduler.entity';

@Controller('task-scheduler')
export class TaskSchedulerController {
  constructor(private readonly taskSchedulerService: TaskSchedulerService) { }

  @Post()
  @ApiOperation({ summary: 'Schedule a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task has been successfully scheduled.',
    type: TaskScheduler
  })

  async scheduleTask(@Body() createTaskDto: CreateTaskSchedulerDto): Promise<TaskScheduler> {
    console.log("🚀 ~ TaskSchedulerController ~ scheduleTask ~ createTaskDto:", createTaskDto)
    return await this.taskSchedulerService.scheduleTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Tasks' })
  @ApiResponse({ type: [TaskScheduler] })

  async getTasks(): Promise<TaskScheduler[]> {

    return await this.taskSchedulerService.getTasks();
  }

}
