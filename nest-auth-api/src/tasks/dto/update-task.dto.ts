import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { TaskStatusDto } from './create-task.dto';

export class UpdateTaskDto {
  @IsString() @IsOptional() @MaxLength(180)
  title?: string;

  @IsString() @IsOptional() @MaxLength(4000)
  description?: string;

  @IsEnum(TaskStatusDto) @IsOptional()
  status?: TaskStatusDto;

  @IsInt() @Min(0) @IsOptional()
  position?: number;

  @IsDateString() @IsOptional()
  dueDate?: string;

  @IsString() @IsOptional()
  assignedTo?: string; // owner can reassign
}
