import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ArticleModule } from './modules/article/article.module';
import { TagModule } from './modules/tag/tag.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtStrategy } from './modules/auth/jwt.strategy';
import { AuthMiddleware } from './modules/common/middleware/auth.middleware';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule, ArticleModule, TagModule, AuthModule],
  providers: [JwtService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
