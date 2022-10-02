import Koa from 'koa';
import { container } from 'tsyringe';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Logger } from '../utils/logger';

export const errorHandlingMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const logger = container.resolve(Logger);
  try {
    await next();
  } catch (error: unknown) {
    if (error instanceof ServiceError) {
      logger.error(error.message, { status: error.statusCode, name: error.name, debug: error.debug });

      ctx.status = error.statusCode;
      ctx.body = {
        name: error.name,
        message: error.message,
      };
    } else {
      if (error instanceof Error) {
        logger.error(error.message, { stackTrace: error.stack });
      } else {
        logger.error('An error of unknown type was caught');
      }

      ctx.status = 500;
      ctx.body = {
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        mesage: 'An unexpected error occurred',
      };
    }
  }
};
