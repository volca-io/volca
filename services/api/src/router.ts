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
  createProjectInvitation,
  acceptProjectInvitation,
  listProjectUsers,
  signOut,
} from './actions';
import { authenticationMiddleware } from './middlewares';
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions

  // Projects
  router.get('/projects/:id', authenticationMiddleware, getProject);
  router.delete('/projects/:id', authenticationMiddleware, deleteProject);
  router.get('/projects', authenticationMiddleware, listProjects);
  router.post('/projects', authenticationMiddleware, createProject);
  router.put('/projects/:id', authenticationMiddleware, updateProject);

  // Project users
  router.get('/projects/users/:projectId', authenticationMiddleware, listProjectUsers);

  // Project invitations
  router.post('/project-invitations', authenticationMiddleware, createProjectInvitation);
  router.get('/project-invitations/:key', authenticationMiddleware, acceptProjectInvitation);

  // Hello world
  router.get('/hello-world', helloWorldAction);

  // Users
  router.get('/me', authenticationMiddleware, getMe);

  // Authentication
  router.post('/authn/password', authnPassword);
  router.post('/authn/sign-out', signOut);
  router.post('/authn/register', register);

  // Post action middlewares

  return router;
};
