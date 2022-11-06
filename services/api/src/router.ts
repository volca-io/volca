import Router from '@koa/router';
import Application from 'koa';
import body from 'koa-bodyparser';

import { statusAction } from './actions/status';

/* volca-exclude-start os */
import {
  authnPasswordAction,
  authnPasswordSchema,
  resetPasswordAction,
  resetPasswordSchema,
  verifyResetPasswordAction,
  verifyResetPasswordSchema,
  verifyUserAction,
  verifyUserSchema,
  refreshAction,
  registerAction,
  registerSchema,
  signOutAction,
  resendUserVerificationAction,
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
  deleteProjectUserAction,
  getProjectAction,
  listProjectsAction,
  listProjectUsersAction,
  updateProjectAction,
  updateProjectSchema,
} from './actions/projects';

import { createStripeSessionAction, createStripeBillingPortalSessionAction } from './actions/stripe';

import {
  authenticationMiddleware,
  schemaValidationMiddleware,
  projectAdminMiddleware,
  projectUserMiddleware,
} from './middlewares';
import { sendMessageAction, sendMessageSchema } from './actions/communications';
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
  router.get('/projects/:projectId', authenticationMiddleware, projectUserMiddleware, getProjectAction);
  router.delete('/projects/:projectId', authenticationMiddleware, projectAdminMiddleware, deleteProjectAction);
  router.get('/projects', authenticationMiddleware, listProjectsAction);
  router.post(
    '/projects',
    authenticationMiddleware,
    schemaValidationMiddleware(createProjectSchema),
    createProjectAction
  );
  router.put(
    '/projects/:projectId',
    authenticationMiddleware,
    projectUserMiddleware,
    schemaValidationMiddleware(updateProjectSchema),
    updateProjectAction
  );

  // Project users
  router.get('/projects/:projectId/users', authenticationMiddleware, projectUserMiddleware, listProjectUsersAction);
  router.delete(
    '/projects/:projectId/users/:userId',
    authenticationMiddleware,
    projectAdminMiddleware,
    deleteProjectUserAction
  );

  // Project invitations
  router.post(
    '/project-invitations',
    authenticationMiddleware,
    projectUserMiddleware,
    schemaValidationMiddleware(createProjectInvitationSchema),
    createProjectInvitationAction
  );
  router.get('/project-invitations/:key', authenticationMiddleware, acceptProjectInvitationAction);

  // Users
  router.get('/me', authenticationMiddleware, getMeAction);

  // Authentication
  router.post('/authn/password', schemaValidationMiddleware(authnPasswordSchema), authnPasswordAction);
  router.post('/authn/reset-password', schemaValidationMiddleware(resetPasswordSchema), resetPasswordAction);
  router.post(
    '/authn/reset-password/verify',
    schemaValidationMiddleware(verifyResetPasswordSchema),
    verifyResetPasswordAction
  );
  router.post('/authn/verify-user', schemaValidationMiddleware(verifyUserSchema), verifyUserAction);
  router.post('/authn/resend-verification', authenticationMiddleware, resendUserVerificationAction);
  router.post('/authn/sign-out', signOutAction);
  router.post('/authn/register', schemaValidationMiddleware(registerSchema), registerAction);
  router.post('/authn/refresh', refreshAction);
  router.post('/authn/refresh/verify', refreshAction);

  // Communications
  router.post(
    '/communications/support',
    authenticationMiddleware,
    schemaValidationMiddleware(sendMessageSchema),
    sendMessageAction
  );

  // Stripe
  router.post('/stripe/sessions', authenticationMiddleware, createStripeSessionAction);
  router.post('/stripe/billing-portal-sessions', authenticationMiddleware, createStripeBillingPortalSessionAction);

  /* volca-exclude-end os */

  // Post action middlewares

  return router;
};
