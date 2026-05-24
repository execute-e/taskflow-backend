import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/db/PrismaService/PrismaService';

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async create() {}

  public async findById() {}

  public async findByEmail() {}
}
