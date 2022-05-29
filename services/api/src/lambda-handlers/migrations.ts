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
  console.log('Running up migration');
  const knex = getDbInstance();

  try {
    const res = await knex.migrate.up();
    console.log('Successfully ran up migration', res);
  } catch (error: any) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const latest = async () => {
  console.log('Running latest migration');

  const knex = getDbInstance();

  try {
    const res = await knex.migrate.latest();
    console.log('Successfully ran latest migration', res);
  } catch (error: any) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const down = async () => {
  console.log('Running down migration');

  const knex = getDbInstance();

  try {
    const res = await knex.migrate.down();
    console.log('Successfully ran down migration', res);
  } catch (error: any) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const rollback = async () => {
  console.log('Running rollback migration');

  const knex = getDbInstance();

  try {
    const res = await knex.migrate.rollback();
    console.log('Successfully ran rollback migration', res);
  } catch (error: any) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};
