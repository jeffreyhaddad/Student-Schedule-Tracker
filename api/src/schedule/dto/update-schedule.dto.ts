import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
} from 'class-validator';

export class UpdateScheduleDTO {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsOptional()
  weekday?: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  @IsOptional()
  startTime?: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  @IsOptional()
  endTime?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
