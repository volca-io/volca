import Router from '@koa/router';
import Application from 'koa';
import { helloWorldAction } from './actions';
import { createContext } from './middlewares/create-context';
import { CustomContext } from './types';

export const createRouter = (): Router => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(createContext);

  // Actions
  router.get('/hello-world', helloWorldAction);

  // Post action middlewares

  return router;
};
