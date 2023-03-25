import { userOne } from '../../test-utils/fixtures/user';
import { setupServer } from '../../test-utils';

describe('POST /authn/refresh', () => {
  const getAgent = setupServer({ agent: true });

  it('can refresh a token after signing in', async () => {
    await getAgent().post('/authn/password').send({ email: userOne.email, password: userOne.password });
    const res = await getAgent().post('/authn/refresh');
    expect(res.status).toBe(200);

    const keys = Object.keys(res.body);
    expect(keys).toContain('access_token');
    expect(keys).toContain('expires_in');
  });

  it('fails to refresh if no cookie is supplied', async () => {
    await getAgent().post('/authn/sign-out').send();

    const res = await getAgent().post('/authn/refresh');
    expect(res.status).toBe(401);
  });
});
