import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TaskSchedulerService } from './task-scheduler.service';
import { TaskSchedulerController } from './task-scheduler.controller';
import { TaskSchedulerRepository } from './repository/task-scheduler.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskScheduler } from './entities/task-scheduler.entity';
import { BullModule } from '@nestjs/bull';
import { TaskProcessor } from './task-processor';
import { ValidationMiddleware } from 'src/middleware/validation.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskScheduler]),
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  controllers: [TaskSchedulerController],
  providers: [TaskSchedulerService , TaskSchedulerRepository, TaskProcessor],
})
export class TaskSchedulerModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidationMiddleware).forRoutes('task-scheduler');
  }
}

