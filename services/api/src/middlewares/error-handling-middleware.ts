import Koa from 'koa';
import { container } from '../inversify.config';
import { ServiceError } from '../errors/service-error';
import { DI_TYPES } from '../types';
import { Logger } from '../interfaces';
import { ErrorNames } from 'src/constants';

export const errorHandlingMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const logger = container.get<Logger>(DI_TYPES.Logger);
  try {
    await next();
  } catch (err: unknown) {
    if (err instanceof ServiceError) {
      logger.error(err.message, { status: err.statusCode, name: err.name, debug: err.debug });

      ctx.status = err.statusCode;
      ctx.body = {
        name: err.name,
        message: err.message,
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { statusCode, status, message } = err as any;

      const fallbackedMessage = message || 'An unexpected error occurred';
      const fallbackedStatus = statusCode || status || 500;

      logger.error(fallbackedMessage, { status: fallbackedStatus });

      ctx.status = fallbackedStatus;
      ctx.body = {
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: fallbackedMessage,
      };
    }
  }
};
