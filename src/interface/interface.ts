import { ObjectId } from 'mongoose';

export interface IJwtPayload {
  email: string;
  sub: string;
  iat: number;
  exp: number;
}

export interface IJwtService {
  sign(payload: IJwtPayload): string;
  verify(token: string): IJwtPayload;
}

export interface IUser {
  id: string;
  email: string;
  password: string;
}

export interface UserResponse extends IUser {
  token: string;
}

export interface UserFromDB {
  _id: string | ObjectId;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CreateUserResponse {
  user: UserFromDB;
  token: string;
}

export interface LoginResponse {
  id: string;
  email: string;
}
