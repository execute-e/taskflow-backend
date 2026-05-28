import {
  DISPLAY_NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '@/shared/consts/user-settings';
import { AuthMethod } from '@taskflow/database';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(DISPLAY_NAME_MAX_LENGTH)
  displayName: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  picture?: string;

  @IsEnum(AuthMethod)
  authMethod: AuthMethod;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
