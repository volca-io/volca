import joi, { Schema } from 'joi';
import { container } from 'tsyringe';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  verify_token: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authenticationService = container.resolve(AuthenticationService);

  const { verifyToken } = ctx.request.body;

  await authenticationService.markUserAsVerified(verifyToken);
});
