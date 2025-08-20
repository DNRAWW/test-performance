import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserService } from './modules/user/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Another Knowledge Base')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await (async () => {
    const adminEmail = process.env.ADMIN_EMAIL as string;
    const adminPassword = process.env.ADMIN_PASSWORD as string;

    if(!adminEmail || !adminPassword) {
      return;
    }

    const userService = app.get(UserService);

    
    const admin = await userService.authFindByEmail(adminEmail);

    if (admin) {
      return;
    }

    await userService.create({
      email: adminEmail,
      password: adminPassword,
      username: 'Admin',
    });
  })();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
