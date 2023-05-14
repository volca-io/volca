import { authenticate } from '../../test-utils/authenticate';
import { userOne } from '../../test-utils/fixtures';
import { setupServer } from '../../test-utils/setup-server';

describe('POST /projects', () => {
  const getRequest = setupServer();
  let accessToken: string;

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);
  });

  it('can create a new project and return it together with the owner', async () => {
    const response = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'My new project!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      project: {
        id: expect.any(String),
        name: 'My new project!',
        owner_id: expect.any(String),
        owner: {
          id: expect.any(String),
          has_active_subscription: true,
          first_name: userOne.firstName,
          last_name: userOne.lastName,
          email: userOne.email,
        },
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
    });
  });

  it('returns 400 if no name is specified', async () => {
    const response = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.status).toBe(400);
  });

  it('returns 401 if user is not authorized', async () => {
    const response = await getRequest().post('/projects').send({
      name: 'My new project!',
    });

    expect(response.status).toBe(401);
  });
});
