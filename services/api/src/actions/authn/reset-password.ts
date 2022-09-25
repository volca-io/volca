import joi, { Schema } from 'joi';
import { container } from 'tsyringe';
import { ServiceError } from '../../errors/service-error';

import { AuthenticationService, EmailService } from '../../services';
import { CustomContext } from '../../types';
import { EnvironmentUtils, EnvironmentVariable } from '../../utils/environment';
import { Logger } from '../../utils/logger';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  email: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const logger = container.resolve(Logger);
  const emailService = container.resolve(EmailService);
  const authenticationService = container.resolve(AuthenticationService);
  const environment = container.resolve(EnvironmentUtils);

  const { email } = ctx.request.body;
  try {
    const token = await authenticationService.generatePasswordResetToken(email);
    const appDomain = environment.getOrFail(EnvironmentVariable.APP_DOMAIN);

    const protocol = environment.get(EnvironmentVariable.STAGE) === 'local' ? 'http://' : 'https://';
    const url = new URL(`reset-password/verify`, protocol + appDomain);
    url.searchParams.append('reset-token', token);

    const body = `
      <html>
        <body>
          Hello,<br/>
          <p>We have received a request to reset the password for your user ${email}. No changes have been made to your account yet. If you have not requested this, please ignore this email.</p>
          <p>You can reset your password by clicking the following link:</p>
          <a href="${url}">${url}</a>
        </body>
      </html>
    `;

    await emailService.sendEmail({
      toAddress: email,
      subject: 'Your reset password request',
      body,
    });
  } catch (error: unknown) {
    logger.info('Failed to generate password reset token', { error });
    if (!(error instanceof ServiceError)) {
      throw error;
    }
  }
});
