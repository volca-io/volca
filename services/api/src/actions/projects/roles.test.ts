import { setupServer } from '../../test-utils';
import { generateJwtToken } from '../../test-utils/authentication';
import { userOne, userTwo } from '../../test-utils/fixtures';

describe('roles', () => {
  const getRequest = setupServer();
  let projectId: string;

  beforeAll(async () => {
    const projectResponse = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'Shared Project',
      });
    expect(projectResponse.status).toBe(200);

    const createdProject = projectResponse.body.project;

    const {
      body: {
        projectInvitation: { id },
      },
    } = await getRequest()
      .post(`/projects/${createdProject.id}/invitations`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` });

    await getRequest()
      .get(`/invitations/${id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    projectId = createdProject.id;
  });

  it('can get project as a member', async () => {
    const resp = await getRequest()
      .get(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    expect(resp.status).toBe(200);
  });

  it('cannot update project as a member', async () => {
    const resp = await getRequest()
      .put(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` })
      .send({ name: 'Members Project' });

    expect(resp.status).toBe(403);
  });

  it('can update project as an admin', async () => {
    const meResponse = await getRequest()
      .post('/users/provision')
      .send({ idToken: generateJwtToken(userTwo) });

    expect(meResponse.status).toBe(200);

    await getRequest()
      .put(`/projects/${projectId}/users/${meResponse.body.me.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({ role: 'ADMIN' });

    const resp = await getRequest()
      .put(`/projects/${projectId}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` })
      .send({ name: 'Admins Project' });

    expect(resp.status).toBe(200);
  });
});
