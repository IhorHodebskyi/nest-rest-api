import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/create-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'User created' })
  async createUser(@Res() res: Response, @Body() createUserDto: CreateUserDto) {
    const { createdUser, token } =
      await this.userService.createUser(createUserDto);

    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24,
    });
    return res.status(200).send(createdUser);
  }
}
