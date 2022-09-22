import joi, { Schema } from 'joi';
import { container } from 'tsyringe';

import { EmailService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  email: joi.string().required(),
});

// TODO: Implement password reset in auth service
export const action = useApiAction(async (ctx: CustomContext) => {
  const emailService = container.resolve(EmailService);

  const { email } = ctx.request.body;

  await emailService.sendEmail({
    toAddress: email,
    subject: 'Reset password',
    body: 'Reset your password by clicking this link',
  });

  return {
    body: {},
  };
});
