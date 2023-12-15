import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { config } from '../../utils/environment';

type SendMessageBody = {
  message: string;
};

export const schema: Schema = joi.object({
  message: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    dependencies: {
      services: { communicationsService },
    },
  } = ctx;

  const email = config.fromEmail;
  const { message } = <SendMessageBody>ctx.request.body;

  await communicationsService.sendEmail({
    email,
    subject: `Support request from ${user.firstName} ${user.lastName}`,
    body: message,
    replyTo: user.email,
  });

  return {
    body: { status: 'OK' },
  };
});
