import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async create(dto: CreateUserDto) {
    return this.userRepository.create(dto);
  }

  public async findById() {}

  public async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }
}
