import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  public async create(dto: CreateUserDto) {
    return this.userRepository.create(dto);
  }

  public async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
