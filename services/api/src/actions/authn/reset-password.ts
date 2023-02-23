import joi, { Schema } from 'joi';
import { container } from 'tsyringe';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { CommunicationsService } from '../../services/communications-service';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const schema: Schema = joi.object({
  email: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const authenticationService = container.resolve(AuthenticationService);
  const comsService = container.resolve(CommunicationsService);

  const { email } = ctx.request.body;

  let token: string;
  try {
    token = await authenticationService.generatePasswordResetToken(email);
  } catch (err: unknown) {
    if (err instanceof ServiceError && err.name === ErrorNames.USER_DOES_NOT_EXIST) {
      return;
    }

    throw err;
  }

  await comsService.sendPasswordResetEmail({ email, token });
});
