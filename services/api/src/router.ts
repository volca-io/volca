import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import { helloWorldAction, signIn, listProjects } from './actions';
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions
  router.get('/projects', listProjects);
  router.get('/hello-world', helloWorldAction);
  router.get('/authn/sign-in', signIn);

  // Post action middlewares

  return router;
};
