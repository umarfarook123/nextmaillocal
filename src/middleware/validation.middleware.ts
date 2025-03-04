import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("🚀 ~ ValidationMiddleware ~ use ~ req.originalUrl:", req.originalUrl)

    console.log("🚀 ~ ValidationMiddleware ~ use ~ req.method === 'POST' && req.path === '/task-scheduler':", req.method === 'POST' && req.path === '/task-scheduler')
    console.log("🚀 ~ ValidationMiddleware ~ use ~ req.path:", req.path)
    if (req.method === 'POST' && req.originalUrl === '/task-scheduler') {
      const { scheduledTime } = req.body;
      
      const scheduledDate = new Date(scheduledTime);
      console.log("🚀 ~ ValidationMiddleware ~ use ~ scheduledDate:", scheduledDate)
      if (isNaN(scheduledDate.getTime())) {
        throw new BadRequestException('Invalid scheduled time format');
      }
      console.log("🚀 ~ ValidationMiddleware ~ use ~ scheduledDate <= new Date():", scheduledDate <= new Date())

      if (scheduledDate <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }
    }
    next();

  }
}