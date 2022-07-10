import Koa from 'koa';
import { User } from '../entities';
import { CustomContext } from '../types';

export const authenticationMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  ctx.user = new User(); // placeholder
  await next();
};
