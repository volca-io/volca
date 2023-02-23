import { jest } from '@jest/globals';
import { CommunicationsService } from '../../services/communications-service';
import { createUser } from '../../test-utils';
import { setupServer } from '../../test-utils/setup-server';

describe('POST /authn/verify-user', () => {
  const getRequest = setupServer();
  let generatedToken: string;

  beforeAll(async () => {
    jest.spyOn(CommunicationsService.prototype, 'sendVerificationEmail').mockImplementation(async ({ token }) => {
      generatedToken = token;
    });

    await createUser(getRequest());
  });

  it('can read the generated verification token', async () => {
    expect(generatedToken).not.toBeUndefined();
  });

  it('can verify the newly created user', async () => {
    const res = await getRequest().post('/authn/verify-user').send({ verify_token: generatedToken });

    expect(res.status).toBe(200);
  });

  it('returns a 400 response if no token is present', async () => {
    const res = await getRequest().post('/authn/verify-user');

    expect(res.status).toBe(400);
  });

  it('returns a 401 response if token is invalid', async () => {
    const res = await getRequest().post('/authn/verify-user').send({
      verify_token: 'fbasbfpiqqbbp'
    });

    expect(res.status).toBe(401);
  });
});
