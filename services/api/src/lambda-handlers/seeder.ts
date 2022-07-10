import { initialize } from '../lib/db/knex';

const getDbInstance = () => {
  return initialize({
    client: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });
};

export const up = async () => {
  console.log('Running up seeder');
  const knex = getDbInstance();

  try {
    const res = await knex('users').insert({
      first_name: 'Steven',
      last_name: 'Hawking',
      email: 'stephen@hawking.com',
    });
    console.log('Successfully ran seeder', res);
  } catch (error: any) {
    console.error('Failed to run seeder', error);
  } finally {
    knex.destroy();
  }
};
