import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ValidationPipe from './validation.pipe';

void (async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(ValidationPipe);
  await app.listen(process.env.PORT ?? 3000);
})();
