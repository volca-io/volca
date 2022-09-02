import { initialize } from '../lib/db/knex';

export const up = async () => {
  console.log('Running up seeder');
  const knex = initialize();

  try {
    const res = await knex('users').insert({
      first_name: 'Steven',
      last_name: 'Hawking',
      email: 'stephen@hawking.com',
    });
    console.log('Successfully ran seeder', res);
  } catch (error: unknown) {
    console.error('Failed to run seeder', error);
  } finally {
    knex.destroy();
  }
};
