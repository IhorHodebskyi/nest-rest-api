import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IJwtPayload } from 'src/interface/interface';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

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

  static isTokenValid(req: Request): boolean {
    const token = JwtStrategy.fromTokenAsCookies(req);
    if (!token) return false;

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch {
      return false;
    }
  }

  async validate(payload: IJwtPayload): Promise<{ id: string; email: string }> {
    const { email, sub: id } = payload;
    return { id, email };
  }
}
