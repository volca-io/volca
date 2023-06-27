import { setupServer } from '../../test-utils';
import { generateJwtToken } from '../../test-utils/authentication';

describe('/provision', () => {
  const getRequest = setupServer();

  it('can provision a new user', async () => {
    const response = await getRequest()
      .post('/users/provision')
      .send({
        idToken: generateJwtToken({
          sub: '2b6a3c05-a9a3-4be3-8104-a0047add8432',
          given_name: 'Jane',
          family_name: 'Doe',
          email: 'jane.doe@volca.io',
        }),
      });

    expect(response.status).toBe(200);

    const { me } = response.body;

    expect(me).toMatchObject({
      id: expect.any(String),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@volca.io',
      hasActiveSubscription: expect.any(Boolean),
      freeTrialActivated: expect.any(Boolean),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });
});
