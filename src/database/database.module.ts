import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KnexConfig from '@config/knexfile';
import Knex from 'knex';
import { Model } from 'objection';

const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: DATABASE_CONNECTION,
          useFactory: (config: ConfigService) => {
            const knex = Knex(
              KnexConfig[config.get<string>('NODE_ENV', 'local')],
            );
            Model.knex(knex);

            return knex;
          },
          inject: [ConfigService],
        },
      ],
    };
  }
}
