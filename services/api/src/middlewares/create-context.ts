import { Next } from 'koa';
import { AuthenticationService } from '../services';
import { CustomContext } from '../types';

export const createContext = (ctx: CustomContext, next: Next) => {
  const services = {
    authenticationService: new AuthenticationService(),
  };

  ctx.services = services;

  next();
};
