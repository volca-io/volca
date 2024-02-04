import { generateJwtToken } from '../../test-utils/authentication';
import { userOne } from '../../test-utils/fixtures';
import { useServer } from '../../test-utils/setup-server';

describe('PUT /projects', () => {
  const getRequest = useServer();
  let createdProject: Record<string, unknown>;

  beforeAll(async () => {
    const firstProject = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'First project!',
      });

    expect(firstProject.status).toBe(200);
    createdProject = firstProject.body.project;
  });

  it('can update a project', async () => {
    const response = await getRequest()
      .put(`/projects/${createdProject.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'Updated project',
      });

    expect(response.status).toBe(200);

    const { project } = response.body;
    expect(project).toMatchObject({
      id: expect.any(String),
      name: 'Updated project',
      ownerId: expect.any(String),
      owner: expect.any(Object),
      users: expect.any(Array),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it('returns 401 if user is unauthenticated', async () => {
    const response = await getRequest().put(`/projects/${createdProject.id}`);

    expect(response.status).toBe(401);
  });
});
