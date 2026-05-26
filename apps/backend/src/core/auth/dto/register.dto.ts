import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { PASSWORD_MIN_LENGTH } from 'src/shared/consts/user-settings';
import { IsPasswordsMatchingConstraint } from 'src/shared/decorators/is-passwords-matching-decorator';

export class RegisterDto {
  @IsString({ message: 'displayName must be a string' })
  @IsNotEmpty({ message: 'displayName is required' })
  displayName: string;

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

  @IsString({ message: 'passwordRepeat must be a string' })
  @IsNotEmpty({ message: 'passwordRepeat is required' })
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `passwordRepeat must be at least ${PASSWORD_MIN_LENGTH}`,
  })
  @Validate(IsPasswordsMatchingConstraint, { message: "Passwords don't match" })
  passwordRepeat: string;
}
