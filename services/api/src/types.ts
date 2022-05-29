import { RouterContext } from '@koa/router';
import { AuthenticationService } from './services';

export interface CustomContext extends RouterContext {
  services: {
    authenticationService: AuthenticationService;
  };
}
