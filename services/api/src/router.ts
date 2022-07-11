import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import { helloWorldAction, signIn, listProjects, createProject, updateProject, register } from './actions';
import { getMe } from './actions/get-me';
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions
  router.get('/projects', listProjects);
  router.post('/projects', createProject);
  router.put('/projects/:id', updateProject);
  router.get('/hello-world', helloWorldAction);
  router.get('/authn/sign-in', signIn);
  router.post('/users', register);
  router.get('/me', getMe);

  // Post action middlewares

  return router;
};
