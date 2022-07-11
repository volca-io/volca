import Koa from 'koa';
import { Logger } from 'winston';
import { DI_TYPES } from '../types';
import { container } from '../inversify.config';

export const requestLoggingMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const logger = container.get<Logger>(DI_TYPES.Logger);
  logger.info('Started handling request', {
    path: ctx.path,
  });

  await next();

  logger.info('Completed handling request', {
    path: ctx.path,
    body: ctx.body,
    status: ctx.status,
  });
};
