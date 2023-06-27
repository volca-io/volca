import { generateJwtToken } from '../../test-utils/authentication';
import { userOne } from '../../test-utils/fixtures';
import { setupServer } from '../../test-utils/setup-server';

describe('GET /projects/:id', () => {
  const getRequest = setupServer();
  let createdProject: Record<string, unknown>;

  beforeAll(async () => {
    const response = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'My new project!',
      });

    expect(response.status).toBe(200);

    createdProject = response.body.project;
  });

  it('can fetch a project by id', async () => {
    const response = await getRequest()
      .get(`/projects/${createdProject.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` });

    expect(response.status).toBe(200);
  });

  it('returns 404 if project is not found', async () => {
    const response = await getRequest()
      .get(`/projects/2f5fce93-d811-4ad8-a761-1b6d73ede6ac`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` });

    expect(response.status).toBe(404);
  });

  it('returns 401 if user is unauthenticated', async () => {
    const response = await getRequest().get(`/projects/${createdProject.id}`);

    expect(response.status).toBe(401);
  });

  // Todo - test that we cannot access another users project
  // Todo - test that a project can't be accessed without a subscription
});
