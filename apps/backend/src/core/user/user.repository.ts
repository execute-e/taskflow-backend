import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db/PrismaService/PrismaService';
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
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { accounts: true },
    });

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { accounts: true },
    });
  }
}
