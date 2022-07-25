import joi, { Schema } from 'joi';
import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { AuthenticationService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authnService = container.get<AuthenticationService>(DI_TYPES.AuthenticationService);

  const { email, password } = ctx.request.body;

  const user = await authnService.verifyPassword(email, password);

  const { accessToken, refreshToken, expiresIn } = await authnService.createNewSession(user);
  const cookieConfig = authnService.getRefreshTokenCookieConfiguration();

  ctx.cookies.set('x-refresh-token', refreshToken, cookieConfig);

  return {
    body: {
      accessToken,
      expiresIn,
    },
  };
});
