/* eslint-disable camelcase */
import { SuperTest, Test } from 'supertest';

type TokenResponse = {
  access_token: string;
};

type TestUser = {
  email: string;
  password: string;
};

export const authenticate = async (request: SuperTest<Test>, user: TestUser): Promise<string> => {
  const res = await request.post('/authn/password').send({ email: user.email, password: user.password });

  expect(res.status).toBe(200);
  const { access_token } = res.body as TokenResponse;

  return access_token;
};
