import supertest from 'supertest';

describe('/authn/register', () => {
  const request = supertest('http://localhost:4000');

  it('can successfully register a user and get access tokens', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(200);

    const keys = Object.keys(res.body);
    expect(keys).toContain('access_token');
    expect(keys).toContain('expires_in');
  });

  it('sets the refresh token cookie', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
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
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(409);
  });

  it('returns 400 if first name is not passed', async () => {
    const res = await request.post('/authn/register').send({
      lastName: 'Doe',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if last name is not passed', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      email: 'john.doe@testuser.com',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if email is not passed', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
      password: 'someComplexPassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns 400 if password is not passed', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@testuser.com',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('does not allow registration with a weak password', async () => {
    const res = await request.post('/authn/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe.2@testuser.com',
      password: 'password',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });
});
