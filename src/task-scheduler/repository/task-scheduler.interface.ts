import { UpdateResult } from "typeorm";
import { CreateTaskSchedulerDto } from "../dto/task-scheduler.dto";
import { TaskScheduler } from "../entities/task-scheduler.entity";
import { TaskStatus } from "../enum/task-status.enum";


export interface TaskScheulerRepositoryInterface {

    scheduleTask(CreateTaskSchedulerDto: CreateTaskSchedulerDto): Promise<TaskScheduler>;
    getTask(id: string): Promise<TaskScheduler>;
    updateTaskStatus(id: string, status: TaskStatus): Promise<UpdateResult>;

}
