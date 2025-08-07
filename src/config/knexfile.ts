import { resolve as resolvePath } from 'path';
import * as dotenv from 'dotenv';
import { Knex } from 'knex';

dotenv.config({ path: resolvePath(__dirname, '../../.env') });

const common: Knex.Config = {
  client: 'pg',
  connection: {
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
  },
  migrations: {
    directory: '../database/migrations',
    extension: 'ts',
    tableName: 'schema_migrations',
  },
};

const development: Knex.Config = {};
const local: Knex.Config = {};

const config: { [key: string]: Knex.Config } = {
  local: { ...common, ...local },
  development: { ...common, ...development },
};

export default config;
