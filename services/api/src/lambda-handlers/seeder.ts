import { Logger } from '../utils/logger';
import { createServer } from '../server';

export const handler = async () => {
  const { database } = await createServer();
  const logger = new Logger();
  logger.info(`Running seeder`);

  try {
    const res = await database.seed.run();
    logger.info(`Successfully ran seeds`, { seeds: res });
    database.destroy();
  } catch (error: unknown) {
    logger.error('Failed to run seeder');
    database.destroy();
    throw error;
  }
};
