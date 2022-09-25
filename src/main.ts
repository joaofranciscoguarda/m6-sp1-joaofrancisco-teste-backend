import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Contact List API')
    .setDescription(
      'This is a simple API for users to register their contacts',
    )
    .setVersion('1.0')
    .addTag('contacts')
    .build();
  const document = SwaggerModule.createDocument(
    app,
    config,
  );
  SwaggerModule.setup('docs', app, document);
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
