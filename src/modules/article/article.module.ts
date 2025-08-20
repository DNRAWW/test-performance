import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { PrismaService } from '../common/services/prisma.service';

@Module({
  providers: [ArticleService, PrismaService],
  controllers: [ArticleController]
})
export class ArticleModule {}
