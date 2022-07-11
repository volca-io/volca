import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';
import { Logger } from '../../interfaces';
import { container } from '../../inversify.config';
import { DI_TYPES } from '../../types';

interface InitializeKnexProperties {
  client: 'postgres';
  port: number;
  user: string;
  password: string;
  database: string;
}

export const initialize = ({ client, port, user, password, database }: InitializeKnexProperties) => {
  const logger = container.get<Logger>(DI_TYPES.Logger);

  logger.debug('Creating new knex client');

  const knex = Knex({
    client,
    useNullAsDefault: true,
    connection: {
      port,
      user,
      password,
      database,
      pool: { min: 1, max: 1 },
    },
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  return knex;
};
