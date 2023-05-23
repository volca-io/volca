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
  updateProjectUserAction,
  updateProjectUserSchema,
} from './actions/projects';

import {
  createStripeSessionAction,
  createStripeBillingPortalSessionAction,
  receiveStripeWebhook,
  listPlans,
  createStripeSessionSchema,
} from './actions/stripe';

import { authenticationMiddleware, schemaValidationMiddleware, authorizationMiddleware } from './middlewares';
import { sendMessageAction, sendMessageSchema } from './actions/communications';
import { Role } from './services';
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
  router.get(
    '/projects/:projectId',
    authenticationMiddleware,
    authorizationMiddleware([Role.ADMIN, Role.OWNER, Role.MEMBER]),
    getProjectAction
  );
  router.delete(
    '/projects/:projectId',
    authenticationMiddleware,
    authorizationMiddleware([Role.OWNER, Role.ADMIN]),
    deleteProjectAction
  );
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
    authorizationMiddleware([Role.OWNER, Role.ADMIN]),
    schemaValidationMiddleware(updateProjectSchema),
    updateProjectAction
  );

  // Project users
  router.get(
    '/projects/:projectId/users',
    authenticationMiddleware,
    authorizationMiddleware([Role.OWNER, Role.ADMIN, Role.MEMBER]),
    listProjectUsersAction
  );
  router.delete(
    '/projects/:projectId/users/:userId',
    authenticationMiddleware,
    authorizationMiddleware([Role.OWNER, Role.ADMIN]),
    deleteProjectUserAction
  );
  router.put(
    '/projects/:projectId/users/:userId',
    authenticationMiddleware,
    authorizationMiddleware([Role.OWNER, Role.ADMIN]),
    schemaValidationMiddleware(updateProjectUserSchema),
    updateProjectUserAction
  );

  // Project invitations
  router.post(
    '/project-invitations',
    authenticationMiddleware,
    authorizationMiddleware([Role.OWNER, Role.ADMIN]),
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

  // Communications
  router.post(
    '/communications/support',
    authenticationMiddleware,
    schemaValidationMiddleware(sendMessageSchema),
    sendMessageAction
  );

  // Stripe
  router.post(
    '/stripe/sessions',
    authenticationMiddleware,
    schemaValidationMiddleware(createStripeSessionSchema),
    createStripeSessionAction
  );
  router.post('/stripe/billing-portal-sessions', authenticationMiddleware, createStripeBillingPortalSessionAction);
  router.post('/stripe/webhook', receiveStripeWebhook);
  router.get('/stripe/plans', listPlans);

  /* volca-exclude-end os */

  // Post action middlewares

  return router;
};
