import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export enum TaskStatusDto { TODO='TODO', IN_PROGRESS='IN_PROGRESS', DONE='DONE', BLOCKED='BLOCKED' }

export class CreateTaskDto {
  @IsString() @IsNotEmpty() @MaxLength(180)
  title!: string;

  @IsString() @IsOptional() @MaxLength(4000)
  description?: string;

  @IsEnum(TaskStatusDto) @IsOptional()
  status?: TaskStatusDto;

  @IsInt() @Min(0) @IsOptional()
  position?: number;

  @IsDateString() @IsOptional()
  dueDate?: string;

  @IsString() @IsOptional()
  assignedTo?: string; // userId
}
