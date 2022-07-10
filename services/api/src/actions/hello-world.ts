import { container } from '../inversify.config';
import { CustomContext, DI_TYPES } from '../types';
import { Logger } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const helloWorldAction = useApiAction(async (ctx: CustomContext) => {
  ctx.body = {
    message: 'Hello world!',
  };

  const logger = container.get<Logger>(DI_TYPES.Logger);
  logger.info('Successfully got hello world', { data: 'Hello world' });
});
