import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/consts/user-settings';
import { IsPasswordsMatchingConstraint } from '@/shared/decorators/is-passwords-matching-decorator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(DISPLAY_NAME_MAX_LENGTH)
  displayName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  @Validate(IsPasswordsMatchingConstraint)
  passwordRepeat?: string;
}
