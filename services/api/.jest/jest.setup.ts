import 'reflect-metadata';
import { PlanId } from '../../../config/types';
import { userOne } from '../src/test-utils/fixtures/user';
import { Config } from '../../../config/types';

jest.mock('../src/utils/environment', () => {
  const testConfig = {
    name: 'volca',
    github: {
      organization: 'volca-io',
      repository: 'volca-internal',
    },
    domain: 'volca.io',
    fromEmail: 'admin@mail.volca.io',
    aws: {
      account: '428245413678',
      region: 'eu-central-1',
    },
    environments: {
      local: {
        authentication: {
          identityProviders: {
            google: {},
            facebook: {},
            apple: {},
          },
          loginDomain: 'login.staging.volca.io',
          mockUser: userOne,
        },
        plans: [
          {
            id: PlanId.BASIC,
            stripePriceId: 'price-id',
          },
          {
            id: PlanId.PLUS,
            stripePriceId: 'price_1LsAQnK4oQ2oKqbP2lEUdYiU',
          },
          {
            id: PlanId.PREMIUM,
            stripePriceId: 'price_1LsAQnK4oQ2oKqbP2lEUdYiU',
          },
        ],
        environmentVariables: {
          DB_HOST: 'localhost',
          DB_PORT: '5432',
          IS_TEST: '0',
          REGION: 'local',
          SKIP_TOKEN_VERIFICATION: '0',
          LOGGING_ENABLED: '0',
          FREE_TRIAL_DAYS: '7',
          APP_DOMAIN: 'http://localhost:3000',
          DB_PASSWORD: 'postgres',
          DB_USERNAME: 'postgres',
          ENVIRONMENT: 'local',
          FROM_EMAIL: 'admin@mail.volca.io',
          LOG_LEVEL: 'debug',
          SIGNING_KEY: 'signing-key',
          STRIPE_KEY: 'stripe-key',
          STRIPE_WEBHOOK_SECRET: 'stripe-webhook-secret',
          TEST_CARD_ENABLED: '1',
        },
      },
    },
  } as Config;

  return {
    config: testConfig,
    EnvironmentConfig: testConfig.environments['local'],
    EnvironmentVariables: {
      ...testConfig.environments.local.environmentVariables,
    },
  };
});
