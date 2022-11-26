import { jest } from '@jest/globals';
import { CommunicationsService } from '../../services/communications-service';
import { createUser, TestUser } from '../../test-utils';
import { setupServer } from '../../test-utils/setup-server';

describe('POST /authn/reset-password/verify', () => {
  const getRequest = setupServer();
  let generatedToken: string;
  let user: TestUser;

  beforeAll(async () => {
    jest.spyOn(CommunicationsService.prototype, 'sendPasswordResetEmail').mockImplementation(async ({ token }) => {
      generatedToken = token;
    });

    user = await createUser(getRequest());
    const res = await getRequest().post('/authn/reset-password').send({ email: user.email });
    expect(res.status).toBe(200);
  });

  it('can read the generated token', async () => {
    expect(generatedToken).not.toBeUndefined();
  });

  it('returns a 400 response if no token is present', async () => {
    const res = await getRequest().post('/authn/reset-password/verify').send({ password: 'averyverysecurepassword' });

    expect(res.status).toBe(400);
  });

  it('returns a 400 response if no new password is present', async () => {
    const res = await getRequest().post('/authn/reset-password/verify').send({ reset_token: generatedToken });

    expect(res.status).toBe(400);
  });

  it('returns a 401 response if token is invalid', async () => {
    const res = await getRequest()
      .post('/authn/reset-password/verify')
      .send({ reset_token: 'fafnaofnoaow', password: 'anotherverysecurepassword' });

    expect(res.status).toBe(401);
  });

  it('returns 400 if password is to weak', async () => {
    const res = await getRequest()
      .post('/authn/reset-password/verify')
      .send({ reset_token: generatedToken, password: 'password' });

    expect(res.status).toBe(400);
  });

  it('can set a new password with the password reset token', async () => {
    const res = await getRequest()
      .post('/authn/reset-password/verify')
      .send({ reset_token: generatedToken, password: 'anotherverysecurepassword' });

    expect(res.status).toBe(200);
  });

  it('can sign in with the newly updated password', async () => {
    const res = await getRequest()
      .post('/authn/password')
      .send({ email: user.email, password: 'anotherverysecurepassword' });
    expect(res.status).toBe(200);
  });
});
