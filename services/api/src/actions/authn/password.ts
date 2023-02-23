import joi, { Schema } from 'joi';
import { container } from 'tsyringe';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authnService = container.resolve(AuthenticationService);

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
