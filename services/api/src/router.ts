import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import {
  helloWorldAction,
  authnPassword,
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  register,
  getMe,
} from './actions';
import { authenticationMiddleware } from './middlewares';
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions

  // Projects
  router.get('/projects/:id', getProject);
  router.delete('/projects/:id', deleteProject);
  router.get('/projects', listProjects);
  router.post('/projects', createProject);
  router.put('/projects/:id', updateProject);

  // Hello world
  router.get('/hello-world', helloWorldAction);

  // Users
  router.post('/users', authenticationMiddleware, register);
  router.get('/me', authenticationMiddleware, getMe);

  // Authentication
  router.post('/authn/password', authnPassword);

  // Post action middlewares

  return router;
};
