import { Knex } from 'knex';

export default [
  {
    seed: async (knex: Knex) => {
      await knex('users').del();
      await knex('users').insert([
        {
          firstName: 'Test',
          lastName: 'Testsson',
          email: 'test@test.com',
          cognitoSubject: 'dfa6ee84-e222-4c4b-a504-7952b741a315',
          hasActiveSubscription: true,
        },
        {
          firstName: 'Steven',
          lastName: 'Hawking',
          email: 'stephen@hawking.com',
          cognitoSubject: 'ee3361e3-e6b3-4b6f-8b37-a46fee1312ea',
          hasActiveSubscription: true,
        },
      ]);
    },
  },
] as Array<Knex.Seed>;
