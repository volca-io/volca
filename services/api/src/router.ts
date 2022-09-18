import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import { statusAction } from './actions/status';

/* volca-exclude-start os */
import {
  authnPasswordAction,
  authnPasswordSchema,
  refreshAction,
  registerAction,
  registerSchema,
  signOutAction,
} from './actions/authn';

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

import { createStripeSessionAction, createStripeBillingPortalSessionAction } from './actions/stripe';

import { authenticationMiddleware } from './middlewares';
import { schemaValidationMiddleware } from './middlewares/schema-validation-middleware';
/* volca-exclude-end os */
import { CustomContext } from './types';

export const createRouter = (): Router<Application.DefaultState, CustomContext> => {
  const router = new Router<Application.DefaultState, CustomContext>();

  // Pre action middlewares
  router.use(body());

  // Actions

  // Status
  router.get('/status', statusAction);

  /* volca-exclude-start os */
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

  // Users
  router.get('/me', authenticationMiddleware, getMeAction);

  // Authentication
  router.post('/authn/password', schemaValidationMiddleware(authnPasswordSchema), authnPasswordAction);
  router.post('/authn/sign-out', signOutAction);
  router.post('/authn/register', schemaValidationMiddleware(registerSchema), registerAction);
  router.post('/authn/refresh', refreshAction);

  // Stripe
  router.post('/stripe/sessions', authenticationMiddleware, createStripeSessionAction);
  router.post('/stripe/billing-portal-sessions', authenticationMiddleware, createStripeBillingPortalSessionAction);

  /* volca-exclude-end os */

  // Post action middlewares

  return router;
};
