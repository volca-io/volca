import { useServer } from '../../test-utils';
import { generateJwtToken } from '../../test-utils/authentication';
import { userOne, userTwo } from '../../test-utils/fixtures';

describe('GET /projects/:id/invitations/:id', () => {
  const getRequest = useServer();
  let invitation: Record<string, unknown>;
  let project: Record<string, unknown>;

  beforeAll(async () => {
    const projectResponse = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        name: 'Invitation test project!',
      });
    expect(projectResponse.status).toBe(200);

    project = projectResponse.body.project;
    const invitationResponse = await getRequest()
      .post(`/projects/${project.id}/invitations`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        projectId: project.id,
      });

    invitation = invitationResponse.body.projectInvitation;
  });

  it('returns 400 if the id is incorrect', async () => {
    const resp = await getRequest()
      .get(`/invitations/29904edc-352c-47d5-a57b-f378d55e02f9`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    expect(resp.status).toBe(400);
  });

  it('returns 401 if no access token is present', async () => {
    const resp = await getRequest().get(`/invitations/${invitation.id}`);

    expect(resp.status).toBe(401);
  });

  it('can accept a project invitation', async () => {
    const resp = await getRequest()
      .get(`/invitations/${invitation.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    expect(resp.status).toBe(200);
  });

  it('can only use an invitation once', async () => {
    const newInvitation = await getRequest()
      .post(`/projects/${project.id}/invitations`)
      .set({ Authorization: `Bearer ${generateJwtToken(userOne)}` })
      .send({
        projectId: project.id,
      });

    await getRequest()
      .get(`/invitations/${newInvitation.body.projectInvitation.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    const doubleResponse = await getRequest()
      .get(`/invitations/${newInvitation.body.projectInvitation.id}`)
      .set({ Authorization: `Bearer ${generateJwtToken(userTwo)}` });

    expect(doubleResponse.status).toBe(400);
  });
});
