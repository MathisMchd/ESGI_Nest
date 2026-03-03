import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { setupSwagger } from './swagger/swagger.config';
import { setupScalarDocs } from './scalar/scalar.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');    // toutes les routes → /api/...
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // supprime les champs non déclarés dans les DTOs
      forbidNonWhitelisted: true, // rejette la requête si des champs inconnus sont présents
      transform: true,            // convertit automatiquement les types (ex: "1" → 1)
    }),
  );


  setupSwagger(app);

  await setupScalarDocs(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();



