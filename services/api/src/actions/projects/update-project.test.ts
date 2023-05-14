import { authenticate } from '../../test-utils/authenticate';
import { userOne } from '../../test-utils/fixtures';
import { setupServer } from '../../test-utils/setup-server';

describe('PUT /projects', () => {
  const getRequest = setupServer();
  let accessToken: string;
  let createdProject: Record<string, unknown>;

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);

    const firstProject = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'First project!',
      });

    expect(firstProject.status).toBe(200);
    createdProject = firstProject.body.project;
  });

  it('can update a project', async () => {
    const response = await getRequest()
      .put(`/projects/${createdProject.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'Updated project',
      });

    expect(response.status).toBe(200);

    const { project } = response.body;
    expect(project).toMatchObject({
      id: expect.any(String),
      name: 'Updated project',
      owner_id: expect.any(String),
      owner: expect.any(Object),
      users: expect.any(Array),
      created_at: expect.any(String),
      updated_at: expect.any(String),
    });
  });

  it('returns 401 if user is unauthenticated', async () => {
    const response = await getRequest().put(`/projects/${createdProject.id}`);

    expect(response.status).toBe(401);
  });
});
