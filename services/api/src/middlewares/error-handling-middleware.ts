import Koa from 'koa';
import { container } from 'tsyringe';
import * as Sentry from '@sentry/node';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Logger } from '../utils/logger';
import { EnvironmentConfig } from '../utils/environment';

const logError = (ctx: Koa.Context, error: unknown) => {
  if (EnvironmentConfig.sentry) {
    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => {
        return Sentry.addRequestDataToEvent(event, ctx.request);
      });
      Sentry.captureException(error);
    });
  }
};

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

      if (error.statusCode >= 500 && error.statusCode <= 599) {
        logError(ctx, error);
      }
    } else {
      if (error instanceof Error) {
        logger.error(error.message, { stackTrace: error.stack });
      } else {
        logger.error('An error of unknown type was caught');
      }

      ctx.status = 500;
      ctx.body = {
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
      };

      logError(ctx, error);
    }
  }
};
