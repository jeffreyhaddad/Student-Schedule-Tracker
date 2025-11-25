import {
  IsString,
  IsEmail,
  Matches,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateStudentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
