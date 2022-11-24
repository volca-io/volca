import Koa from 'koa';
import cors from '@koa/cors';
import { container } from 'tsyringe';
import { Knex } from 'knex';
import { createRouter } from './router';
import { requestLoggingMiddleware, correlationIdMiddleware, errorHandlingMiddleware } from './middlewares';
import { EnvironmentUtils } from './utils/environment';
import { initialize } from './lib/db/knex';

type CreateServerResponse = {
  app: Koa
  database: Knex
}

export const createServer = (): CreateServerResponse => {
  const app = new Koa();
  const router = createRouter();

  const environment = container.resolve(EnvironmentUtils);

  app.use(
    cors({
      origin: environment.getWebappDomain(),
      credentials: true,
    })
  );

  app.use(correlationIdMiddleware);
  app.use(requestLoggingMiddleware);
  app.use(errorHandlingMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  const database = initialize()

  return { app, database };
};
