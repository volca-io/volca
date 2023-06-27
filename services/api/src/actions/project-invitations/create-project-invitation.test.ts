import { setupServer } from '../../test-utils';
import { generateJwtToken } from '../../test-utils/authentication';
import { userOne } from '../../test-utils/fixtures';

describe('POST /project-invitations', () => {
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

  it('can create a new project invitation', async () => {
    const resp = await getRequest()
      .post('/project-invitations')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        projectId: createdProject.id,
      });

    expect(resp.status).toBe(200);
  });

  it('returns 400 if no project id is specified', async () => {
    const resp = await getRequest()
      .post('/project-invitations')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({});

    expect(resp.status).toBe(400);
  });

  it('returns 401 if user is not authenticated', async () => {
    const resp = await getRequest().post('/project-invitations').send({
      projectId: createdProject.id,
    });

    expect(resp.status).toBe(401);
  });
});
