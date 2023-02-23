import { setupServer } from '../../test-utils';
import { userOne } from '../../test-utils/fixtures';
import { authenticate } from '../../test-utils/authenticate';

describe('/me', () => {
  const getRequest = setupServer();
  let accessToken: string;

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);
  });

  it('returns the current user', async () => {
    const response = await getRequest()
      .get('/me')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.status).toBe(200);

    const { me } = response.body;

    expect(me).toMatchObject({
      id: expect.any(String),
      first_name: userOne.firstName,
      last_name: userOne.lastName,
      email: userOne.email,
      has_active_subscription: expect.any(Boolean),
      free_trial_activated: expect.any(Boolean),
      verified_at: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });
});
