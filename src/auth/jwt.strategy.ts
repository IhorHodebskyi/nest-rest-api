import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/interface/interface';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.fromTokenAsCookies,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  static fromTokenAsCookies(req: Request) {
    if (!req.cookies) return null;
    return req.cookies['token'];
  }

  async validate(payload: IJwtPayload): Promise<{ id: string; email: string }> {
    const { email, sub: id } = payload;
    return { id, email };
  }
}
