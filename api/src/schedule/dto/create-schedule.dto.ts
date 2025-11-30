import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsBoolean,
  Matches,
  ValidateIf,
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
  @Validate(IsTimeBeforeTime)
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

