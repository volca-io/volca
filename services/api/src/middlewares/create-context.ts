import { Next } from 'koa';
import { HelloWorldService } from '../services';
import { CustomContext } from '../types';

export const createContext = (ctx: CustomContext, next: Next) => {
  const services = {
    helloWorldService: new HelloWorldService(),
  };

  ctx.services = services;

  next();
};
