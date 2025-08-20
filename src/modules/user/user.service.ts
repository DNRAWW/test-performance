

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type TUserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Internal use only
  async authFindByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    data.password = hashedPassword;

    await this.prisma.user.create({ data });

    return true;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    return (await this.prisma.user.findMany()).map(({ password, ...user }) => user);
  }

  async findOne(id: string): Promise<Omit<User, 'password'> | null> {
    const result = await this.prisma.user.findUnique({ where: { id } });

    if(!result) {
      return null;
    }

    return {
      id: result.id,
      email: result.email,
      username: result.username,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async update(id: string, data: Partial<User>): Promise<TUserWithoutPassword> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if(!user) {
      throw new NotFoundException("User not found");
    }

    const result = await this.prisma.user.update({ where: { id }, data });

    return {
      id: result.id,
      email: result.email,
      username: result.username,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async remove(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
