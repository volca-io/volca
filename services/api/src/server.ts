import Koa from "koa";
import { createRouter } from "./router";

export const createServer = (): Koa => {
  const app = new Koa();
  const router = createRouter();

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
