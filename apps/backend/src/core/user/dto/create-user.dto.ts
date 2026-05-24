import { AuthMethod } from '@taskflow/database';

export class CreateUserDto {
  email: string;

  password?: string;

  displayName: string;

  picture: string;

  authMethod: AuthMethod;

  isVerified: boolean;
}
