import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { container } from 'tsyringe';
import { EnvironmentVariables } from '../../utils/environment';
import { Logger } from '../../utils/logger';
import { MigrationSource } from './migration-source';
import { SeedSource } from './seed-source';

export const initialize = () => {
  const logger = container.resolve(Logger);

  logger.debug('Creating new knex client');

  const knex = Knex({
    client: 'postgres',
    useNullAsDefault: true,
    connection: {
      host: EnvironmentVariables.DB_HOST,
      port: 5432,
      user: EnvironmentVariables.DB_USERNAME,
      password: EnvironmentVariables.DB_PASSWORD,
      database: 'postgres',
      pool: { min: 1, max: 1, idleTimeoutMillis: 1000 },
    },
    migrations: {
      migrationSource: new MigrationSource(),
    },
    seeds: {
      seedSource: new SeedSource(),
    },
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  return knex;
};
