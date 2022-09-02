import 'reflect-metadata';
import { initialize } from '../lib/db/knex';

export const up = async () => {
  console.log('Running up migration');
  const knex = initialize();

  try {
    const res = await knex.migrate.up();
    console.log('Successfully ran up migration', res);
  } catch (error: unknown) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const latest = async () => {
  console.log('Running latest migration');

  const knex = initialize();

  try {
    const res = await knex.migrate.latest();
    console.log('Successfully ran latest migration', res);
  } catch (error: unknown) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const down = async () => {
  console.log('Running down migration');

  const knex = initialize();

  try {
    const res = await knex.migrate.down();
    console.log('Successfully ran down migration', res);
  } catch (error: unknown) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};

export const rollback = async () => {
  console.log('Running rollback migration');

  const knex = initialize();

  try {
    const res = await knex.migrate.rollback();
    console.log('Successfully ran rollback migration', res);
  } catch (error: unknown) {
    console.error('Failed to run migration', error);
  } finally {
    knex.destroy();
  }
};
