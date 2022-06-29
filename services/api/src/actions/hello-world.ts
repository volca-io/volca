import { container } from '../inversify.config';
import { CustomContext, DI_TYPES } from '../types';
import { Logger } from '../interfaces';

export const helloWorldAction = (ctx: CustomContext) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    message: 'Hello world!!',
  });

  const logger = container.get<Logger>(DI_TYPES.Logger);
  logger.info('Successfully got hello world', { data: 'Hello world' });
};
