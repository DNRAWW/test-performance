import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string }): Promise<Tag> {
    return await this.prisma.tag.create({ data });
  }

  async findAll(): Promise<Tag[]> {
    return this.prisma.tag.findMany();
  }

  async findOne(id: string): Promise<Tag | null> {
    return await this.prisma.tag.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<Tag>): Promise<Tag> {
    return await this.prisma.tag.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Tag> {
    return await this.prisma.tag.delete({ where: { id } });
  }
}
