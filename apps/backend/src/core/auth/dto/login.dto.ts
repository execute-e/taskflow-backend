import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { PASSWORD_MIN_LENGTH } from 'src/shared/consts/user-settings';

export class LoginDto {
  @IsString({ message: 'email must be a string' })
  @IsEmail({}, { message: 'Incorrect email format' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString({ message: 'password must be a string' })
  @IsNotEmpty({ message: 'password is required' })
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
  })
  password: string;
}
