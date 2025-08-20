import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body() dto: CreateTagDto) {
    return await this.tagService.create(dto);
  }

  @Get()
  async findAll() {
    return await this.tagService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tagService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  async update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return await this.tagService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async remove(@Param('id') id: string) {
    return await this.tagService.remove(id);
  }
}
