import { LoginResponse } from './../interface/interface';
import { Controller, Req, Res, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IUser } from 'src/interface/interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User Login successfully',
    headers: {
      token: {
        description: 'JWT token for authentication',
        schema: {
          type: 'string',
        },
      },
    },
    schema: {
      example: {
        email: 'user@example.com',
        password: '123456',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request, @Res() res: Response) {
    const { token, id, email } = await this.authService.login(
      req.user as IUser,
    );

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    return res.status(200).send({ id, email } as LoginResponse);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    schema: {
      example: { id: 'user123', email: 'user@example.com', name: 'User Name' },
    },
  })
  getProfile(@Req() req): IUser {
    return req.user;
  }
}
