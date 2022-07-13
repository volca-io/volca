import { Container } from 'inversify';
import 'reflect-metadata';

import { DI_TYPES } from './types';
import {
  UserService,
  AuthenticationService,
  ProjectService,
  ProjectInvitationService,
  ProjectUserService,
  StripeService,
} from './services';
import { Logger } from './utils/logger';
import {
  UserService as UserServiceInterface,
  ProjectService as ProjectServiceInterface,
  AuthenticationService as AuthenticationServiceInterface,
  ProjectInvitationService as ProjectInvitationServiceInterface,
  Logger as LoggerInterface,
  Security as SecurityInterface,
  ProjectUserService as ProjectUserServiceInterface,
  StripeService as StripeServiceInterface,
} from './interfaces';
import { Security } from './lib/security/security';

const container = new Container();

// Libs
container.bind<SecurityInterface>(DI_TYPES.Security).to(Security);

// Utils
container.bind<LoggerInterface>(DI_TYPES.Logger).to(Logger);

// Services
container.bind<UserServiceInterface>(DI_TYPES.UserService).to(UserService);
container.bind<ProjectServiceInterface>(DI_TYPES.ProjectService).to(ProjectService);
container.bind<AuthenticationServiceInterface>(DI_TYPES.AuthenticationService).to(AuthenticationService);
container.bind<ProjectInvitationServiceInterface>(DI_TYPES.ProjectInvitationService).to(ProjectInvitationService);
container.bind<ProjectUserServiceInterface>(DI_TYPES.ProjectUserService).to(ProjectUserService);
container.bind<StripeServiceInterface>(DI_TYPES.StripeService).to(StripeService);

export { container };
