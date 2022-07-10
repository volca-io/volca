import { Container } from 'inversify';
import 'reflect-metadata';
import { Model } from 'objection';

import { DI_TYPES } from './types';
import { UserService, AuthenticationService, ProjectService } from './services';
import { Logger } from './utils/logger';
import { User } from './entities';
import {
  UserService as UserServiceInterface,
  ProjectService as ProjectServiceInterface,
  AuthenticationService as AuthenticationServiceInterface,
  Logger as LoggerInterface,
} from './interfaces';

const container = new Container();
// Utils
container.bind<LoggerInterface>(DI_TYPES.Logger).to(Logger);

// Services
container.bind<UserServiceInterface>(DI_TYPES.UserService).to(UserService);
container.bind<ProjectServiceInterface>(DI_TYPES.ProjectService).to(ProjectService);
container.bind<AuthenticationServiceInterface>(DI_TYPES.AuthenticationService).to(AuthenticationService);

// Models
container.bind<Model>(DI_TYPES.User).to(User);

export { container };
