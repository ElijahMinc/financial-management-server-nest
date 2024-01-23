import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    //  console.log('authService', authService);
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    console.log('user', email, password);

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      console.log('we are here');
      throw new UnauthorizedException();
    }
    return user;
  }
}
