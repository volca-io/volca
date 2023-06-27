import joi, { Schema } from 'joi';
import { EnvironmentVariables } from '../../utils/environment';

import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { CommunicationsService } from '../../services';
import { User } from '../../entities';

type SendMessageBody = {
  message: string;
};

export const schema: Schema = joi.object({
  message: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const commsService = container.resolve(CommunicationsService);
  const user = container.resolve<User>('AuthenticatedUser');
  const email = EnvironmentVariables.FROM_EMAIL;

  const { message } = <SendMessageBody>ctx.request.body;

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
