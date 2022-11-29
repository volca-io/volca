import { setupServer } from '../../test-utils';
import { authenticate } from '../../test-utils/authenticate';
import { userOne, userTwo } from '../../test-utils/fixtures';

describe('GET /project-invitations/:key', () => {
  const getRequest = setupServer();
  let accessToken: string;
  let secondUserAccessToken: string;

  let invitation: Record<string, unknown>;

  beforeAll(async () => {
    accessToken = await authenticate(getRequest(), userOne);
    secondUserAccessToken = await authenticate(getRequest(), userTwo);

    const projectResponse = await getRequest()
      .post('/projects')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        name: 'Invitation test project!',
      });
    expect(projectResponse.status).toBe(200);

    const createdProject = projectResponse.body.project;
    const invitationResponse = await getRequest()
      .post('/project-invitations')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        to_user_email: userTwo.email,
        project_id: createdProject.id,
      });

    invitation = invitationResponse.body.project_invitation;
  });

  it('returns 400 if the key is incorrect', async () => {
    const resp = await getRequest()
      .get(`/project-invitations/29904edc-352c-47d5-a57b-f378d55e02f9`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` });

    expect(resp.status).toBe(400);
  });

  it('returns 401 if no access token is present', async () => {
    const resp = await getRequest().get(`/project-invitations/${invitation.key}`);

    expect(resp.status).toBe(401);
  });

  it('returns 401 if the wrong user tries to accept the invitation', async () => {
    const resp = await getRequest()
      .get(`/project-invitations/${invitation.key}`)
      .set({ Authorization: `Bearer ${accessToken}` });

    expect(resp.status).toBe(401);
  });

  it('can accept a project invitation', async () => {
    const resp = await getRequest()
      .get(`/project-invitations/${invitation.key}`)
      .set({ Authorization: `Bearer ${secondUserAccessToken}` });

    expect(resp.status).toBe(200);
  });
});
