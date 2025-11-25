import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
} from 'class-validator';

export class CreateScheduleDTO {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  weekday: number; // 0=Sunday, 6=Saturday

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  @IsNotEmpty()
  startTime: string; // HH:MM format

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  @IsNotEmpty()
  endTime: string; // HH:MM format

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}
