import Koa from 'koa';
import { CustomContext } from '../types';
import {
  /* volca-exclude-start os */
  AuthenticationService,
  CommunicationsService,
  ProjectInvitationService,
  ProjectService,
  ProjectUserService,
  StripeService,
  UserService,
  /* volca-exclude-end os */
  StatusService,
} from '../services';
import { Logger } from '../utils/logger';

export const dependencyInjectionMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  const logger = new Logger();

  /* volca-exclude-start os */
  const authenticationService = new AuthenticationService();
  const communicationsService = new CommunicationsService(logger);
  const userService = new UserService();
  const stripeService = new StripeService(userService);
  const projectService = new ProjectService();
  const projectUserService = new ProjectUserService();
  const projectInvitationService = new ProjectInvitationService(projectUserService);
  /* volca-exclude-end os */
  const statusService = new StatusService();

  ctx.dependencies = {
    utils: {
      logger,
    },
    services: {
      /* volca-exclude-start os */
      authenticationService,
      communicationsService,
      projectService,
      projectInvitationService,
      projectUserService,
      stripeService,
      userService,
      /* volca-exclude-end os */
      statusService,
    },
  };

  await next();
};
