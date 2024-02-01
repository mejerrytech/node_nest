import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { config } from 'src/constants/config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/interfaces/auth.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private reflector: Reflector) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecretKey,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<any> {
    // const user = await this.authService.validateUser(username, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return jwtPayload;
  }
}
