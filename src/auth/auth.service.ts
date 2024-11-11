import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser, UserFromDB } from 'src/interface/interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    email: string,
    password: string,
  ): Promise<BadRequestException | UserFromDB> {
    const user = await this.usersService.findOne(email);
    if (!user) return null;
    const passwordIsMatch = await bcrypt.compare(password, user.password);
    return passwordIsMatch ? user : null;
  }

  async login(
    user: IUser,
  ): Promise<{ id: string; email: string; token: string }> {
    const { id, email } = user;
    const payload = { email: email, sub: id };

    return {
      id,
      email,
      token: this.jwtService.sign(payload),
    };
  }
}
