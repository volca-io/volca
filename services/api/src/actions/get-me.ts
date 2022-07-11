import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';

export const getMe = async (ctx: CustomContext) => {
  const userService = container.get<UserService>(DI_TYPES.UserService);

  ctx.body = {
    me: await userService.findById(ctx.user.id),
  };
};
