import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { Logger } from '../../utils/logger';
import { container } from 'tsyringe';

interface InitializeKnexProperties {
  client: 'postgres';
  port: number;
  user: string;
  password: string;
  database: string;
}

export const initialize = ({ client, port, user, password, database }: InitializeKnexProperties) => {
  const logger = container.resolve(Logger);

  logger.debug('Creating new knex client');

  const knex = Knex({
    client,
    useNullAsDefault: true,
    connection: {
      port,
      user,
      password,
      database,
      pool: { min: 1, max: 1, idleTimeoutMillis: 1000 },
    },
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  return knex;
};
