import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateStudentDTO {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  firstName?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  lastName?: string;
}
