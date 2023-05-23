import { setupServer } from '../../test-utils';
import { authenticate } from '../../test-utils/authenticate';
import { userOne, userTwo } from '../../test-utils/fixtures';

describe('roles', () => {
  const getRequest = setupServer();
  let accessToken: string;
  let secondUserAccessToken: string;
  let projectId: string;

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);
    secondUserAccessToken = await authenticate(getRequest(), userTwo);

    const projectResponse = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'Shared Project',
      });
    expect(projectResponse.status).toBe(200);

    const createdProject = projectResponse.body.project;

    const {
      body: {
        project_invitation: { key },
      },
    } = await getRequest()
      .post('/project-invitations')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        to_user_email: userTwo.email,
        project_id: createdProject.id,
      });

    await getRequest()
      .get(`/project-invitations/${key}`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` });

    projectId = createdProject.id;
  });

  it('can get project as a member', async () => {
    const resp = await getRequest()
      .get(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` });

    expect(resp.status).toBe(200);
  });

  it('cannot update project as a member', async () => {
    const resp = await getRequest()
      .put(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` })
      .send({ name: 'Members Project' });

    expect(resp.status).toBe(403);
  });

  it('can update project as an admin', async () => {
    const meResponse = await getRequest()
      .get('/me')
      .set({ Authorization: `Bearer ${secondUserAccessToken}` });

    await getRequest()
      .put(`/projects/${projectId}/users/${meResponse.body.me.id}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ role: 'ADMIN' });

    const resp = await getRequest()
      .put(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` })
      .send({ name: 'Admins Project' });

    expect(resp.status).toBe(200);
  });
});
