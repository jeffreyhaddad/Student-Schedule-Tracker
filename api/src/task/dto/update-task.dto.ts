import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class UpdateTaskDTO {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueAt?: string;

  @IsEnum(['pending', 'in-progress', 'completed'])
  @IsOptional()
  status?: string;

  @IsEnum(['low', 'normal', 'high'])
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
