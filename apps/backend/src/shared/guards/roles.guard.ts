import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@taskflow/database';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest<Request>();

    if (!roles) return true;
    if (!request.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!roles.includes(request.user?.role)) {
      throw new HttpException(
        'Insufficient privileges to access this resource',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
