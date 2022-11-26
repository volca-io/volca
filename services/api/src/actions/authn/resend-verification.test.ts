import { setupServer } from '../../test-utils/setup-server';
import { userOne } from '../../test-utils/fixtures/user';

describe('POST /authn/resend-verification', () => {
  const getRequest = setupServer();
  let headers: Record<string, string>;

  beforeAll(async () => {
    const { body } = await getRequest().post('/authn/password').send({ email: userOne.email, password: userOne.password });
    headers = { Authorization: `Bearer ${body.access_token}` };
  });

  it('can successfully register call the resend-verification endpoint', async () => {
    const res = await getRequest().post('/authn/resend-verification').set(headers);

    expect(res.status).toBe(200);
  });
});
