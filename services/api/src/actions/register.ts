import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const register = useApiAction(async (ctx: CustomContext) => {
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

  return {
    body: user.toDTO(),
  };
});
