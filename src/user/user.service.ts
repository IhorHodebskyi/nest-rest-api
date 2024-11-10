import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './userDTO/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserFromDB } from 'src/interface/interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;
    const existsEmail = await this.userModel.exists({
      email,
    });
    if (existsEmail) {
      throw new BadRequestException('User with this email already exists');
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const passwordHash = await bcrypt.hash(password, salt);

    const createdUser = await this.userModel.create<{
      email: string;
      password: string;
      name: string;
    }>({
      email,
      password: passwordHash,
      name,
    });
    const token = this.jwtService.sign({
      id: createdUser._id.toString(),
      email: createdUser.email,
    });

    return {
      createdUser,
      token,
    };
  }

  async findOne(email: string): Promise<UserFromDB> {
    const user = (await this.userModel.findOne({ email })) as UserFromDB;
    return user;
  }
}
