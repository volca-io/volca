import { generateJwtToken } from '../../test-utils/authentication';
import { userOne } from '../../test-utils/fixtures';
import { useServer } from '../../test-utils/setup-server';

describe('POST /projects', () => {
  const getRequest = useServer();

  it('can create a new project and return it together with the owner', async () => {
    const response = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'My new project!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      project: {
        id: expect.any(String),
        name: 'My new project!',
        ownerId: expect.any(String),
        owner: {
          id: expect.any(String),
          hasActiveSubscription: true,
          firstName: userOne.firstName,
          lastName: userOne.lastName,
          email: userOne.email,
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it('returns 400 if no name is specified', async () => {
    const response = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` });

    expect(response.status).toBe(400);
  });

  it('returns 401 if user is not authorized', async () => {
    const response = await getRequest().post('/projects').send({
      name: 'My new project!',
    });

    expect(response.status).toBe(401);
  });
});
