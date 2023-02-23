import { setupServer } from '../../test-utils/setup-server';

describe('POST /authn/sign-out', () => {
  const getAgent = setupServer({ agent: true });

  beforeAll(async () => {
    const res = await getAgent().post('/authn/password').send({ email: 'test@test.com', password: 'somesecurepassword' });

    expect(res.status).toBe(200);
  });

  it('removes the refresh token cookie', async () => {
    const res = await getAgent().post('/authn/sign-out').send();

    const cookies = res.headers['set-cookie'][0] as string;
    const refreshTokenCookie = cookies
      .split(',')
      .map((item) => item.split(';')[0])
      .find((cookie) => cookie.startsWith('x-refresh-token'));

    expect(refreshTokenCookie).toMatch(/x-refresh-token=/);

    expect(res.status).toBe(200);
  });
});
