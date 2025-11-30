import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
  Validate,
} from 'class-validator';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isTimeBeforeTime' })
export class IsTimeBeforeTime implements ValidatorConstraintInterface {
  validate(endTime: string, args: any): boolean {
    const { object } = args;
    if (!object.startTime || !endTime) return true;

    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    return timeToMinutes(endTime) > timeToMinutes(object.startTime);
  }

  defaultMessage(): string {
    return 'endTime must be after startTime';
  }
}

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
  @Validate(IsTimeBeforeTime)
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

