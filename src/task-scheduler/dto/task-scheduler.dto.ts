import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsDefined, IsEnum, IsNotEmpty, IsString} from "class-validator";
import { TaskType } from "../enum/task-type.enum";


export class CreateTaskSchedulerDto {
    @ApiProperty({ example: 'Send welcome email', required: true })
    @IsString()
    @IsDefined()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: TaskType, example: TaskType.EMAIL, required: true })
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(TaskType)
    type: TaskType;

    @ApiProperty({ example: '2025-04-28T15:13:19Z', required: true })
    @IsDateString()
    @IsDefined()
    @IsNotEmpty()
    scheduledTime: string;

}



