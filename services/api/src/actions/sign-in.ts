import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { AuthenticationService } from 'src/services';

export const signIn = async (ctx: CustomContext) => {
  const authnService = container.get<AuthenticationService>(DI_TYPES.AuthenticationService);
  const res = await authnService.authenticatePassword('username', 'password');

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    result: res,
  });
};
