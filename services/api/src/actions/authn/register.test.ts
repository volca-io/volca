import { jest } from '@jest/globals';
import { MockInstance } from 'jest-mock';
import { v4 as uuid } from 'uuid';
import { CommunicationsService } from '../../services/communications-service';
import { setupServer } from '../../test-utils';

describe('POST /authn/register', () => {
  const getRequest = setupServer();
  let comsSpy: MockInstance<
    ({ email, firstName, token }: { email: string; firstName: string; token: string }) => Promise<void>
  >;

  beforeAll(() => {
    comsSpy = jest.spyOn(CommunicationsService.prototype, 'sendVerificationEmail').mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('can successfully register a user and get access tokens', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(200);

    const keys = Object.keys(res.body);
    expect(keys).toContain('access_token');
    expect(keys).toContain('expires_in');
  });

  it('sends a verification email to the user', async () => {
    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: `${uuid()}@testuser.com`,
      password: 'someComplexPassword',
    };

    const res = await getRequest().post('/authn/register').send(user);

    expect(res.status).toBe(200);

    expect(comsSpy).toHaveBeenCalledTimes(1);
    expect(comsSpy).toHaveBeenCalledWith({ email: user.email, firstName: 'John', token: expect.any(String) });
  });

  it('sets the refresh token cookie', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe.2@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(200);

    const cookies = res.headers['set-cookie'][0] as string;
    const refreshTokenCookie = cookies
      .split(',')
      .map((item) => item.split(';')[0])
      .find((cookie) => cookie.startsWith('x-refresh-token'));

    expect(refreshTokenCookie).toMatch(/x-refresh-token=.*/);
  });

  it('does not allow a duplicate user to be registered', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(409);
  });

  it('returns 400 if first name is not passed', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if last name is not passed', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if email is not passed', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if password is not passed', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@testuser.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('does not allow registration with a weak password', async () => {
    const res = await getRequest().post('/authn/register').send({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe.2@testuser.com',
      password: 'password',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });
});
