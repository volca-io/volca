import { authenticate } from '../../test-utils/authenticate';
import { userOne } from '../../test-utils/fixtures';
import { setupServer } from '../../test-utils/setup-server';

describe('GET /projects', () => {
  const getRequest = setupServer();
  let accessToken: string;
  const createdProjects: Array<Record<string, unknown>> = [];

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);

    const firstProject = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'First project!',
      });

    expect(firstProject.status).toBe(200);
    createdProjects.push(firstProject.body.project);

    const secondProject = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'Second project!',
      });

    expect(secondProject.status).toBe(200);
    createdProjects.push(secondProject.body.project);
  });

  it('can fetch a list of projects', async () => {
    const response = await getRequest()
    .get('/projects')
    .set({ Authorization: `Bearer ${accessToken}` });

    expect(response.status).toBe(200);

    const { projects } = response.body
    expect(projects.length).toBeGreaterThan(0)
  });

  it('returns 401 if user is unauthenticated', async () => {
    const response = await getRequest().get('/projects');

    expect(response.status).toBe(401);
  });

  // Todo - test that we cannot access another users project
  // Todo - test that a project can't be accessed without a subscription
});
