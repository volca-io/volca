import Knex from 'knex';
import { Model, knexSnakeCaseMappers } from 'objection';

interface InitializeKnexProperties {
  client: 'postgres';
  port: number;
  user: string;
  password: string;
  database: string;
}

export const initialize = ({ client, port, user, password, database }: InitializeKnexProperties) => {
  const knex = Knex({
    client,
    useNullAsDefault: true,
    connection: {
      port,
      user,
      password,
      database,
    },
    ...knexSnakeCaseMappers(),
  });

  Model.knex(knex);

  return knex;
};
