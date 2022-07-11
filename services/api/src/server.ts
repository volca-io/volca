import Koa from 'koa';
import cors from '@koa/cors';
import { createRouter } from './router';
import {
  requestLoggingMiddleware,
  correlationIdMiddleware,
  authenticationMiddleware,
  errorHandlingMiddleware,
} from './middlewares';

export const createServer = (): Koa => {
  const app = new Koa();
  const router = createRouter();

  app.use(cors());
  app.use(correlationIdMiddleware);
  app.use(errorHandlingMiddleware);
  app.use(requestLoggingMiddleware);
  app.use(authenticationMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
