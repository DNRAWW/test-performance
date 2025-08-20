import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto, GetAllDto, UpdateArticleDto } from './dto/article.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TUser } from 'src/types';

@ApiTags('article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async create(@Body() dto: CreateArticleDto, @CurrentUser() user: TUser) {
    return await this.articleService.create({
      ...dto,
      published: dto.published || false,
      tagNames: dto.tagNames,
      authorId: user.id,
    });
  }

  @Post('findAll')
  async findAll(@CurrentUser() user: TUser, @Body() query: GetAllDto) {
    return await this.articleService.findAll(query.tagIds, Boolean(user));
  }

  @Get(':id')
  async findOne(@CurrentUser() user: TUser, @Param('id') id: string) {
    const result = await this.articleService.findOne(id, Boolean(user));

    if(!result) {
      throw new NotFoundException("Article not found");
    }

    return result;
  }

  @Patch(':id')
  @UseGuards(AuthGuard("jwt"))
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return await this.articleService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard("jwt"))
  async remove(@Param('id') id: string) {
    return await this.articleService.remove(id);
  }
}
