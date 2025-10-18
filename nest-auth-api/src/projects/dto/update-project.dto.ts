import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDto {
  @IsString() @IsOptional() @MaxLength(120)
  name?: string;

  @IsString() @IsOptional() @MaxLength(2000)
  description?: string;
}