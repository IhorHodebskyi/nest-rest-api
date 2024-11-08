import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class AuthUserDto {
  @ApiProperty({ example: '5F9iK@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'User password' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
