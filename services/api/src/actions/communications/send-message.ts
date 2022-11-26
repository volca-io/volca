import joi, { Schema } from 'joi';
import { EnvironmentUtils, EnvironmentVariable } from '../../utils/environment';

import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { CommunicationsService } from '../../services';
import { User } from '../../entities';

export const schema: Schema = joi.object({
  message: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const commsService = container.resolve(CommunicationsService);
  const environment = container.resolve(EnvironmentUtils);
  const user = container.resolve<User>('AuthenticatedUser');
  const email = environment.getOrFail(EnvironmentVariable.FROM_EMAIL);

  const { message } = ctx.request.body;

  await commsService.sendEmail({
    email,
    subject: `Support request from ${user.firstName} ${user.lastName}`,
    body: message,
    replyTo: user.email,
  });

  return {
    body: { status: 'OK' },
  };
});
