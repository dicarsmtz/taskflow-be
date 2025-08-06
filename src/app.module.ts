import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@database/database.module';
import { AppService } from '@source/app.service';
import { validate as validateEnv } from '@config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      validate: validateEnv,
    }),
    DatabaseModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
