import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ValidationPipe from './validation.pipe';
import { ModelOmitInterceptor } from './model-omit.interceptor';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import metadata from './metadata';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(ValidationPipe);
  app.useGlobalInterceptors(new ModelOmitInterceptor());

  const documentConfig = new DocumentBuilder()
    .setTitle('TaskFlow API')
    .addBearerAuth()
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .addTag('tags')
    .build();

  const documentOptions: SwaggerCustomOptions = {
    ui: true,
    raw: ['json'],
  };

  await SwaggerModule.loadPluginMetadata(metadata);
  const documentFactory = () =>
    SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, documentFactory, documentOptions);

  await app.listen(process.env.PORT ?? 3000);
})();
