import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { container } from 'tsyringe';
import { EnvironmentUtils, EnvironmentVariable } from '../../utils/environment';
import { Logger } from '../../utils/logger';
import { MigrationSource } from './migration-source';

export const initialize = () => {
  const logger = container.resolve(Logger);
  const environment = container.resolve(EnvironmentUtils);

  logger.debug('Creating new knex client');

  const knex = Knex({
    client: 'postgres',
    useNullAsDefault: true,
    connection: {
      host: environment.getVariable(EnvironmentVariable.DB_HOST),
      port: 5432,
      user: environment.getVariable(EnvironmentVariable.DB_USER),
      password: environment.getVariable(EnvironmentVariable.DB_PASSWORD),
      database: 'postgres',
      pool: { min: 1, max: 1, idleTimeoutMillis: 1000 },
    },
    migrations: {
      migrationSource: new MigrationSource(),
    },
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  return knex;
};
