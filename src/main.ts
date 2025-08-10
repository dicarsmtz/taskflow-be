import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ValidationPipe from './validation.pipe';
import { ModelOmitInterceptor } from './model-omit.interceptor';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(ValidationPipe);
  app.useGlobalInterceptors(new ModelOmitInterceptor());
  await app.listen(process.env.PORT ?? 3000);
})();
