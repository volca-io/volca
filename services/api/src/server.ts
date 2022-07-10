import Koa from 'koa';
import { createRouter } from './router';
import { requestLoggingMiddleware, correlationIdMiddleware, authenticationMiddleware } from './middlewares';

export const createServer = (): Koa => {
  const app = new Koa();
  const router = createRouter();

  app.use(correlationIdMiddleware);
  app.use(requestLoggingMiddleware);
  app.use(authenticationMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
