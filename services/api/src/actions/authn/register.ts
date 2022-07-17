import joi, { Schema } from 'joi';
import zxcvbn from 'zxcvbn';
import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { AuthenticationService, UserService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

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

  const userService = container.get<UserService>(DI_TYPES.UserService);
  const authnService = container.get<AuthenticationService>(DI_TYPES.AuthenticationService);

  const user = await userService.register({
    firstName,
    lastName,
    email,
    password,
  });

  const token = authnService.generateAccessToken(user);
  const cookieConfig = authnService.getAccessTokenCookieSettings();

  ctx.cookies.set('x-access-token', token, cookieConfig);
});
