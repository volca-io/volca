import joi, { Schema } from 'joi';
import zxcvbn from 'zxcvbn';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { AuthenticationService, UserService } from '../../services';

export const schema: Schema = joi.object({
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().required(),
  password: joi
    .string()
    .required()
    .custom((val: string) => {
      const { score, feedback } = zxcvbn(val);

      if (score < 2) {
        throw new Error(`assword is not strong enough. ${feedback.warning}`);
      }

      return true;
    }, 'Password strength validation'),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    request: {
      body: { firstName, lastName, email, password },
    },
  } = ctx;

  const userService = container.resolve(UserService);
  const authnService = container.resolve(AuthenticationService);

  const user = await userService.register({
    firstName,
    lastName,
    email,
    password,
  });

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
