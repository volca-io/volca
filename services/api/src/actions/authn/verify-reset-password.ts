import joi, { Schema } from 'joi';
import { container } from 'tsyringe';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  password: joi.string().required(),
  resetToken: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authenticationService = container.resolve(AuthenticationService);

  const { resetToken, password } = ctx.request.body;

  await authenticationService.resetPassword(password, resetToken);
});
