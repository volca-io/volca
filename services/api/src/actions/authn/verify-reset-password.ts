import joi, { Schema } from 'joi';
import { container } from 'tsyringe';
import zxcvbn from 'zxcvbn';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  password: joi
    .string()
    .required()
    .custom((val: string) => {
      const { score, feedback } = zxcvbn(val);

      if (score < 2) {
        throw new Error(`Password is not strong enough. ${feedback.warning}`);
      }

      return true;
    }, 'Password strength validation'),
  reset_token: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authenticationService = container.resolve(AuthenticationService);

  const { resetToken, password } = ctx.request.body;

  await authenticationService.resetPassword(password, resetToken);
});
