import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the project')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const documentFactory: () => Omit<
    ReturnType<typeof SwaggerModule.createDocument>,
    'toString'
  > = () => SwaggerModule.createDocument(app, config);
  app.use(cookieParser());
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
