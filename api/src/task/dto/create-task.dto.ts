import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

export class CreateTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueAt?: string;

  @IsEnum(['pending', 'in-progress', 'completed'])
  @IsOptional()
  status?: string = 'pending';

  @IsEnum(['low', 'normal', 'high'])
  @IsOptional()
  priority?: string = 'normal';

  @IsString()
  @IsOptional()
  category?: string;
}
