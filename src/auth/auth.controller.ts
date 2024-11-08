import { Controller, Request, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IUser } from 'src/interface/interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User Login successfully',
    schema: {
      example: {
        email: 'user@example.com',
        password: '123456',
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req,
  ): Promise<{ id: string; email: string; token: string }> {
    return this.authService.login(req.user);
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
  getProfile(@Request() req): IUser {
    return req.user;
  }
}
