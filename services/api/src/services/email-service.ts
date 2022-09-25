import { injectable } from 'tsyringe';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { EnvironmentUtils, EnvironmentVariable } from '../utils/environment';
import { Logger } from '../utils/logger';

type SendEmailParams = {
  toAddress: string;
  subject: string;
  body: string;
};

@injectable()
export class EmailService {
  private client: SESv2Client;

  constructor(private environment: EnvironmentUtils, private logger: Logger) {
    this.environment = environment;
    this.client = new SESv2Client({ region: 'eu-central-1' }); // TODO: Put region in environment
  }

  public async sendEmail({ toAddress, subject, body }: SendEmailParams): Promise<void> {
    this.logger.debug('Sending email', { toAddress, subject, body });

    const fromEmail = this.environment.getOrFail(EnvironmentVariable.FROM_EMAIL);

    const command = new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: { ToAddresses: [toAddress] },

      Content: { Simple: { Subject: { Data: subject }, Body: { Text: { Data: body }, Html: { Data: body } } } },
    });
    await this.client.send(command);
  }
}
