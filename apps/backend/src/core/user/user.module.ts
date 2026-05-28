import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from '@/config/db/PrismaService/PrismaService';
import { UserRepository } from './user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
