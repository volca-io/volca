import Koa from 'koa';
import cors from '@koa/cors';
import { Knex } from 'knex';
import * as Sentry from '@sentry/node';
import { createRouter } from './router';
import { requestLoggingMiddleware, correlationIdMiddleware, errorHandlingMiddleware } from './middlewares';
import { EnvironmentConfig, EnvironmentVariables } from './utils/environment';
import { initialize } from './lib/db/knex';

type CreateServerResponse = {
  app: Koa;
  database: Knex;
};

export const createServer = (): CreateServerResponse => {
  const app = new Koa();
  const router = createRouter();

  if (EnvironmentConfig.sentry) {
    Sentry.init({
      dsn: EnvironmentConfig.sentry.apiDsn,
      environment: process.env.ENVIRONMENT,
    });
  }

  app.use(
    cors({
      origin: EnvironmentVariables.APP_DOMAIN,
      credentials: true,
    })
  );

  app.use(correlationIdMiddleware);
  app.use(requestLoggingMiddleware);
  app.use(errorHandlingMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  const database = initialize();

  return { app, database };
};
