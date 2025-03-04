import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { Repository, UpdateResult } from "typeorm";
import { TaskScheulerRepositoryInterface } from "./task-scheduler.interface";
import { TaskScheduler } from "../entities/task-scheduler.entity";
import { CreateTaskSchedulerDto } from "../dto/task-scheduler.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskStatus } from "../enum/task-status.enum";



@Injectable({ scope: Scope.REQUEST })
export class TaskSchedulerRepository
  implements TaskScheulerRepositoryInterface {
  constructor(@InjectRepository(TaskScheduler) private taskSchedulerRepository: Repository<TaskScheduler>) { }

  async scheduleTask(CreateTaskSchedulerDto: CreateTaskSchedulerDto): Promise<TaskScheduler> {

    const scheduleData = this.taskSchedulerRepository.create(CreateTaskSchedulerDto);
    return await this.taskSchedulerRepository.save(scheduleData);

  }

  async getTask(id: string): Promise<TaskScheduler> {

    const task = await this.taskSchedulerRepository.createQueryBuilder()
      .where('id = :id', { id })
      .getOne();
    if (!task) throw new NotFoundException(`Task with ID "${id}" not found`);
    return task;
  }

  async getTasks(): Promise<TaskScheduler[]> {

   return await this.taskSchedulerRepository.createQueryBuilder().orderBy('id', 'ASC').getMany();

  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<UpdateResult> {

    return await this.taskSchedulerRepository.createQueryBuilder()
      .update(TaskScheduler)
      .set({ status })
      .where("id = :id", { id })
      .execute();
  }

}