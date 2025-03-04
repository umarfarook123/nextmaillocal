import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AwsServiceService } from './aws-service.service';

@Controller('aws-service')
export class AwsServiceController {
  constructor(private readonly awsServiceService: AwsServiceService) { }

}
