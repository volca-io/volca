import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';

export const register = async (ctx: CustomContext) => {
  const {
    request: {
      body: { firstName, lastName, email, password },
    },
  } = ctx;

  const userService = container.get<UserService>(DI_TYPES.UserService);

  const user = await userService.register({
    firstName,
    lastName,
    email,
    password,
  });

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify(user.toDTO());
};
