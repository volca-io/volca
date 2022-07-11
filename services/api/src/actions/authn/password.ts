import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { AuthenticationService } from '../../services';
import { useApiAction } from '../utils/api-action';

export const authnPassword = useApiAction(async (ctx: CustomContext) => {
  const authnService = container.get<AuthenticationService>(DI_TYPES.AuthenticationService);

  const { email, password } = ctx.request.body;

  const user = await authnService.verifyPassword(email, password);

  const token = authnService.generateAccessToken({ sub: user.id });

  return {
    body: {
      accessToken: token,
    },
  };
});
