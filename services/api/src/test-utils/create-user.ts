import { SuperTest, Test } from 'supertest';
import { v4 as uuid } from 'uuid';

export type TestUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const createUser = async (request: SuperTest<Test>): Promise<TestUser> => {
  const user: TestUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: `${uuid()}@testuser.com`,
    password: 'someComplexPassword',
  };

  const res = await request.post('/authn/register').send({
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
  });

  expect(res.status).toBe(200);

  return user;
};
