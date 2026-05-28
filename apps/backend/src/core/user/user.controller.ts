import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { Authorization } from '@/shared/decorators/auth.decorator';
import { UserRole } from '@taskflow/database';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @Authorization()
  public async findProfile(@CurrentUser('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') userId: string) {
    return this.userService.findById(userId);
  }
}
