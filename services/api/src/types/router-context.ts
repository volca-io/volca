import { RouterContext } from '@koa/router';
import {
  AuthenticationService,
  CommunicationsService,
  ProjectInvitationService,
  ProjectService,
  ProjectUserService,
  StatusService,
  StripeService,
  UserService,
} from '../services';
import { Logger } from '../utils/logger';
/* volca-exclude-start os */
import { Project, User } from '../entities';
/* volca-exclude-end os */

export interface CustomContext extends RouterContext {
  correlationId: string;
  dependencies: {
    utils: {
      logger: Logger;
    };
    services: {
      authenticationService: AuthenticationService;
      communicationsService: CommunicationsService;
      projectService: ProjectService;
      projectInvitationService: ProjectInvitationService;
      projectUserService: ProjectUserService;
      statusService: StatusService;
      stripeService: StripeService;
      userService: UserService;
    };
  };
  /* volca-exclude-start os */
  user: User;
  project: Project;
  /* volca-exclude-end os */
}
