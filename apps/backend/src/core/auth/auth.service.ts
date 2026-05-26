import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { AuthMethod, User } from '@taskflow/database';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new HttpException(
        'Registration failed. User with this email already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newUser = await this.userService.create({
      email: dto.email,
      password: dto.password,
      displayName: dto.displayName,
      picture: '',
      authMethod: AuthMethod.CREDENTIALS,
      isVerified: false,
    });

    return this.saveSession(req, newUser);
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    return this.saveSession(req, user);
  }

  public logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((error) => {
        if (error) {
          return reject(
            new HttpException(
              'Failed to end session',
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        resolve();
      });
    });
  }

  private saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save((error) => {
        if (error) {
          reject(
            new HttpException(
              `Failed to save session: ${error}`,
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }
        resolve({ user });
      });
    });
  }
}
