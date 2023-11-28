import { Knex, knex } from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { container } from 'tsyringe';
import { EnvironmentVariables } from '../../utils/environment';
import { Logger } from '../../utils/logger';
import { MigrationSource } from './migration-source';
import { SeedSource } from './seed-source';

export const initialize = () => {
  const logger = container.resolve(Logger);

  logger.debug('Creating new knex client');

  const config: Knex.Config = {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      host: EnvironmentVariables.DB_HOST,
      port: parseInt(EnvironmentVariables.DB_PORT, 10),
      user: EnvironmentVariables.DB_USERNAME,
      password: EnvironmentVariables.DB_PASSWORD,
      database: 'postgres',
      pool: { min: 1, max: 1, idleTimeoutMillis: 1000 },
      ssl: EnvironmentVariables.ENVIRONMENT !== 'local',
    },
    migrations: {
      migrationSource: new MigrationSource(),
    },
    seeds: {
      seedSource: new SeedSource(),
    },

    ...knexSnakeCaseMappers(),
  };

  const db = knex(config);

  Model.knex(db);

  return db;
};
