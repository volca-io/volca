import { jest } from '@jest/globals';
import { CommunicationsService } from '../../services/communications-service';
import { setupServer } from '../../test-utils/setup-server';


describe('POST /authn/reset-password', () => {
  const getRequest = setupServer();

  it('can successfully call the reset-password endpoint', async () => {
    const res = await getRequest().post('/authn/reset-password').send({ email: 'test@test.com' });
    expect(res.status).toBe(200);
  });

  it('sends and email to the user with a reset password token', async () => {
    const comsSpy = jest.spyOn(CommunicationsService.prototype, 'sendPasswordResetEmail').mockResolvedValue()

    await getRequest().post('/authn/reset-password').send({ email: 'test@test.com' });

    expect(comsSpy).toHaveBeenCalledTimes(1)
    expect(comsSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: expect.any(String) })
  });

  it('returns 200 if the user is not found', async () => {
    const res = await getRequest().post('/authn/reset-password').send({ email: 'userthatdoesnotexist@test.com' });
    expect(res.status).toBe(200);
  });

  it('returns 400 if no email is specified', async () => {
    const res = await getRequest().post('/authn/reset-password').send({ email: '' });
    expect(res.status).toBe(400);
  });
});
