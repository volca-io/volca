import Koa from 'koa';
import { Logger } from '../utils/logger';
import { container } from 'tsyringe';
import { RouterContext } from '@koa/router';

export const requestLoggingMiddleware = async (ctx: RouterContext, next: Koa.Next) => {
  const logger = container.resolve(Logger);

  // TODO - Clean body to not disclose sensitive values
  logger.info('Started handling request', {
    path: ctx.path,
    method: ctx.method,
    body: ctx.request.body,
  });

  await next();

  logger.info('Completed handling request', {
    path: ctx.path,
    method: ctx.method,
    body: ctx.response.body,
    status: ctx.status,
  });
};
