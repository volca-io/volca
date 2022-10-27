import joi, { Schema } from 'joi';
import { container } from 'tsyringe';
import { ServiceError } from '../../errors/service-error';

import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { Logger } from '../../utils/logger';
import { useApiAction } from '../utils/api-action';
import { CommunicationsService } from '../../services/communications-service';

export const schema: Schema = joi.object({
  email: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const logger = container.resolve(Logger);
  const authenticationService = container.resolve(AuthenticationService);
  const comsService = container.resolve(CommunicationsService)

  const { email } = ctx.request.body;
  try {
    const token = await authenticationService.generatePasswordResetToken(email);
    comsService.sendPasswordResetEmail({ email, token })


  } catch (error: unknown) {
    logger.info('Failed to generate password reset token', { error });
    if (!(error instanceof ServiceError)) {
      throw error;
    }
  }
});
