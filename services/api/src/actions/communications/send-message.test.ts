import { CommunicationsService, SendEmailParams } from '../../services';
import { generateJwtToken } from '../../test-utils/authentication';
import { userOne } from '../../test-utils/fixtures';
import { setupServer } from '../../test-utils/setup-server';
import { config } from '../../utils/environment';

describe('POST /communications/support', () => {
  const getRequest = setupServer();
  let comsSpy: jest.SpyInstance<Promise<void>, [SendEmailParams], unknown>;

  beforeAll(() => {
    comsSpy = jest.spyOn(CommunicationsService.prototype, 'sendEmail').mockResolvedValue();
  });

  it('returns 400 if no message is specified', async () => {
    const response = await getRequest()
      .post('/communications/support')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` });

    expect(response.status).toBe(400);
  });

  it('returns 401 if no message is specified', async () => {
    const response = await getRequest().post('/communications/support').send({
      message: 'I need help!',
    });

    expect(response.status).toBe(401);
  });

  it('can successfully send a message', async () => {
    const response = await getRequest()
      .post('/communications/support')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        message: 'I need help!',
      });

    expect(response.status).toBe(200);
    expect(comsSpy).toHaveBeenCalledWith({
      email: config.fromEmail,
      subject: `Support request from ${userOne.firstName} ${userOne.lastName}`,
      body: 'I need help!',
      replyTo: userOne.email,
    });
  });
});
