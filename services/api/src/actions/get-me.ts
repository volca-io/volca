import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const getMe = useApiAction(async (ctx: CustomContext) => {
  const userService = container.get<UserService>(DI_TYPES.UserService);

  return {
    body: {
      me: await userService.findById(ctx.user.id),
    },
  };
});
