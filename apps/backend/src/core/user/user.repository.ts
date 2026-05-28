import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/config/db/PrismaService/PrismaService';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  async create({
    email,
    password,
    isVerified,
    authMethod,
    picture,
    displayName,
  }: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        email,
        password: password ? await hash(password) : '',
        displayName,
        picture,
        authMethod,
        isVerified,
      },
      include: {
        accounts: true,
      },
    });
  }

  async findById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: { accounts: true },
    });
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
  }
}
