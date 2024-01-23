import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './types/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, inputPassword: string): Promise<any> {
    console.log('validateUser', email, inputPassword);
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new UnauthorizedException('Email or password are incorrect!');
    }

    const passwordIsMatch = await argon2.verify(user?.password, inputPassword);

    if (passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('Email or password are incorrect!');
  }

  async login(user: IUser) {
    const { id, email } = user;

    return {
      id,
      email,
      token: this.jwtService.sign({ id, email }),
    };
  }
}
