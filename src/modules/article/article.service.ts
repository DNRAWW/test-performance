import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { Article, ArticleTags, Tag } from '@prisma/client';

export type TFormattedArticles = Article & {
  tags: string[];
};

export type TArticlesWithTags = (Article & { articleTags: { tag: { name: string } }[] })[]

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; content: string; published?: boolean; authorId: string; tagNames?: string[] }): Promise<Article> {
    const { tagNames, ...articleData } = data;
    let articleTags: Tag[] | undefined = undefined;
    if (tagNames && tagNames.length > 0) {
      articleTags = await Promise.all(tagNames.map(async (name) => {
        const tag = await this.prisma.tag.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        return tag;
      }));
    }

    return await this.prisma.article.create({
      data: {
        ...articleData,
        articleTags: articleTags ? {
          create: articleTags.map(tag => ({
            tag: { connect: { id: tag.id } }
          }))
        } : undefined
      },
    });
  }

  async findAll(tagIds?: string[], isUserAuthed: boolean = false): Promise<Article[]> {
    const result = await this.prisma.article.findMany({ 
      where: tagIds ? {
        articleTags: {
          some: {
            tagId: { in: tagIds },
          },
        },
      } : undefined,
      include: { articleTags: {
        include: { tag: true }
      } } 
    });

    let formattedArticles = this.formatArticles(result);

    if(!isUserAuthed) {
      formattedArticles = formattedArticles.filter(article => article.published);
    }

    return formattedArticles;
  }

  async findOne(id: string, isUserAuthed: boolean = false): Promise<Article | null> {
    const result = await this.prisma.article.findUnique({ where: { id }, include: { articleTags: { include: { tag: true } } } });

    if(!result) {
      return null;
    }

    if(!result?.published && !isUserAuthed) {
      return null;
    }

    const formattedArticles = this.formatArticles([result]);

    return formattedArticles[0];
  }

  async update(id: string, data: Partial<Article>): Promise<Article> {
    return await this.prisma.article.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Article> {
    return await this.prisma.article.delete({ where: { id } });
  }

  private formatArticles(articles: TArticlesWithTags): TFormattedArticles[] {
    return articles.map(article => ({
      ...article,
      tags: article.articleTags.map(tag => tag.tag.name),
      articleTags: undefined,
    }));
  }
}
