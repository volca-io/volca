import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import {
  authnPasswordAction,
  authnPasswordSchema,
  registerAction,
  registerSchema,
  signOutAction,
} from './actions/authn';
import { helloWorldAction } from './actions/hello-world';
import { getMeAction } from './actions/users';
import {
  createProjectInvitationAction,
  createProjectInvitationSchema,
  acceptProjectInvitationAction,
} from './actions/project-invitations';
import {
  createProjectAction,
  createProjectSchema,
  deleteProjectAction,
  getProjectAction,
  listProjectsAction,
  listProjectUsersAction,
  updateProjectAction,
  updateProjectSchema,
} from './actions/projects';

import { createStripeSessionAction } from './actions/stripe';

import { authenticationMiddleware } from './middlewares';
import { schemaValidationMiddleware } from './middlewares/schema-validation-middleware';
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions

  // Projects
  router.get('/projects/:id', authenticationMiddleware, getProjectAction);
  router.delete('/projects/:id', authenticationMiddleware, deleteProjectAction);
  router.get('/projects', authenticationMiddleware, listProjectsAction);
  router.post(
    '/projects',
    authenticationMiddleware,
    schemaValidationMiddleware(createProjectSchema),
    createProjectAction
  );
  router.put(
    '/projects/:id',
    authenticationMiddleware,
    schemaValidationMiddleware(updateProjectSchema),
    updateProjectAction
  );

  // Project users
  router.get('/projects/users/:projectId', authenticationMiddleware, listProjectUsersAction);

  // Project invitations
  router.post(
    '/project-invitations',
    authenticationMiddleware,
    schemaValidationMiddleware(createProjectInvitationSchema),
    createProjectInvitationAction
  );
  router.get('/project-invitations/:key', authenticationMiddleware, acceptProjectInvitationAction);

  // Hello world
  router.get('/hello-world', helloWorldAction);

  // Users
  router.get('/me', authenticationMiddleware, getMeAction);

  // Authentication
  router.post('/authn/password', schemaValidationMiddleware(authnPasswordSchema), authnPasswordAction);
  router.post('/authn/sign-out', signOutAction);
  router.post('/authn/register', schemaValidationMiddleware(registerSchema), registerAction);

  // Stripe
  router.post('/stripe/sessions', authenticationMiddleware, createStripeSessionAction);

  // Post action middlewares

  return router;
};
