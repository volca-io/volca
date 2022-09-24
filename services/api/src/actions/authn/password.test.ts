import supertest from 'supertest';

type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

describe('/authn/password', () => {
  const request = supertest('http://localhost:4000');

  const user: User = {
    firstName: 'Test',
    lastName: 'Testsson',
    email: 'test@test.com',
    password: 'somesecurepassword',
  };

  it('can sign in with a newly created user and return tokens', async () => {
    const res = await request.post('/authn/password').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);

    const keys = Object.keys(res.body);
    expect(keys).toContain('access_token');
    expect(keys).toContain('expires_in');

    const cookies = res.headers['set-cookie'][0] as string;
    const refreshTokenCookie = cookies
      .split(',')
      .map((item) => item.split(';')[0])
      .find((cookie) => cookie.startsWith('x-refresh-token'));

    expect(refreshTokenCookie).toMatch(/x-refresh-token=.*/);
  });

  it("returns unauthorized if it's the wrong password", async () => {
    const res = await request.post('/authn/password').send({ email: user.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it("returns unauthorized if it's the wrong email", async () => {
    const res = await request
      .post('/authn/password')
      .send({ email: 'some-random-user@user.com', password: user.password });

    expect(res.status).toBe(401);
  });

  it('returns validation error if no email is supplied', async () => {
    const res = await request.post('/authn/password').send({
      password: 'foo',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });

  it('returns validation error if no password is supplied', async () => {
    const res = await request.post('/authn/password').send({
      email: 'bla@bla.se',
    });

    expect(res.status).toBe(400);
    expect(res.body.name).toBe('VALIDATION_ERROR');
  });
});
