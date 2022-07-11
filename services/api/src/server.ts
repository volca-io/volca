import Koa from 'koa';
import cors from '@koa/cors';
import { createRouter } from './router';
import { requestLoggingMiddleware, correlationIdMiddleware, errorHandlingMiddleware } from './middlewares';

export const createServer = (): Koa => {
  const app = new Koa();
  const router = createRouter();

  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(correlationIdMiddleware);
  app.use(errorHandlingMiddleware);
  app.use(requestLoggingMiddleware);

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
