import Koa from 'koa';
import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';

export const authenticationMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  if (process.env.ENVIRONMENT === 'local') {
    const userService = container.get<UserService>(DI_TYPES.UserService);
    const testUser = await userService.findByEmail('stephen@hawking.com');
    if (testUser) {
      ctx.user = testUser;
    }
  }

  await next();
};
