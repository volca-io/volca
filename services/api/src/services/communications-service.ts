import { injectable } from 'tsyringe';

import { EnvironmentVariables } from '../utils/environment';
import { resetPasswordTemplate, verifyAccountTemplate } from '../email-templates';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2';
import { Logger } from '../utils/logger';

export type SendVerificationEmailProperties = {
  email: string;
  firstName: string;
  token: string;
};

export type SendPasswordResetEmailProperties = {
  email: string;
  token: string;
};

export type SendEmailParams = {
  email: string;
  subject: string;
  body: string;
  replyTo?: string | null;
};

@injectable()
export class CommunicationsService {
  private emailClient: SESv2Client;

  public constructor(private logger: Logger) {
    this.emailClient = new SESv2Client({ region: EnvironmentVariables.REGION });
  }

  public async sendEmail({ email, subject, body, replyTo = null }: SendEmailParams): Promise<void> {
    this.logger.debug('Sending email', { email, subject, body });

    const command = new SendEmailCommand({
      FromEmailAddress: EnvironmentVariables.FROM_EMAIL,
      Destination: { ToAddresses: [email] },
      Content: { Simple: { Subject: { Data: subject }, Body: { Text: { Data: body }, Html: { Data: body } } } },
      ...(replyTo ? { ReplyToAddresses: [replyTo] } : {}),
    });

    try {
      await this.emailClient.send(command);
    } catch (error: unknown) {
      this.logger.warn('Failed to send email', { error });
    }
  }

  public async sendVerificationEmail({ email, firstName, token }: SendVerificationEmailProperties): Promise<void> {
    const url = new URL(`/verify`, EnvironmentVariables.APP_DOMAIN);
    url.searchParams.append('verify-token', token);

    return this.sendEmail({
      email,
      subject: verifyAccountTemplate.subject,
      body: verifyAccountTemplate.generateBody({ firstName, url: url.toString() }),
    });
  }

  public async sendPasswordResetEmail({ email, token }: SendPasswordResetEmailProperties): Promise<void> {
    const url = new URL(`reset-password/verify`, EnvironmentVariables.APP_DOMAIN);
    url.searchParams.append('reset-token', token);

    this.sendEmail({
      email,
      subject: resetPasswordTemplate.subject,
      body: resetPasswordTemplate.generateBody({ email, url: url.toString() }),
    });
  }
}
