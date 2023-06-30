import { Config, Environments, PlanId } from './config/types';
import { DEFAULT_ENVIRONMENT_VARIABLES, getEnvVar } from './config/utils';

const coreConfig: Omit<Config, 'environments'> = {
  name: 'my-app',
  github: {
    organization: 'my-github-organization',
    repository: 'my-github-repo',
  },
  domain: 'example.com',
  fromEmail: 'admin@example.com',
  aws: {
    account: '000000000000',
    region: 'us-east-1',
  },
};

const environments: Environments = {
  local: {
    authentication: {
      // Add identity providers and login domain section to use authentication with AWS cognito locally
      // This requires that you have deployed your infrastructure stacks.
      // identityProviders: {
      //   google: {},
      //   facebook: {},
      //   apple: {},
      // },
      // loginDomain: 'login.staging.my-app.io',

      // Specifying a mock user in the config will bypass AWS Cognito and let you run the app locally
      // To use proper authentication, you can deploy your infrastructure to aws and specify a login domain
      // instead of a mock user.
      mockUser: {
        sub: 'c8a03b26-970d-463d-a256-feb0dbb51574',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@volca.io',
      },
    },
    storage: {
      enabled: true,
    },
    plans: [
      {
        id: PlanId.BASIC,
        stripePriceId: 'price-id',
      },
      {
        id: PlanId.PLUS,
        stripePriceId: 'price-id',
      },
      {
        id: PlanId.PREMIUM,
        stripePriceId: 'price-id',
      },
    ],
    environmentVariables: {
      ...DEFAULT_ENVIRONMENT_VARIABLES,
      APP_DOMAIN: getEnvVar('APP_DOMAIN', 'http://localhost:3000'),
      DB_PASSWORD: getEnvVar('PASSWORD', 'postgres'),
      DB_USERNAME: getEnvVar('DB_USERNAME', 'postgres'),
      ENVIRONMENT: 'local',
      REGION: coreConfig.aws.region,
      FROM_EMAIL: getEnvVar('FROM_EMAIL', 'noreply@example.com'),
      LOG_LEVEL: getEnvVar('LOG_LEVEL', 'debug'),
      SIGNING_KEY: getEnvVar('SIGNING_KEY', 'signing-key'),
      STRIPE_KEY: getEnvVar('STRIPE_KEY', 'stripe-key'),
      STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET', 'stripe-webhook-secret'),
      TEST_CARD_ENABLED: getEnvVar('TEST_CARD_ENABLED', '1'),

      // Set this values when using cognito as authentication
      // AWS_COGNITO_USER_POOL_ID: 'userpool-id',
      // AWS_COGNITO_APP_CLIENT_ID: 'app-client-id',
    },
  },
  staging: {
    authentication: {
      identityProviders: {
        google: {
          clientId: 'google-app-client-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          clientSecretSsmPath: '/app/environment/AWS_COGNITO_GOOGLE_CLIENT_SECRET',
        },
        facebook: {
          clientId: 'facebook-app-client-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          clientSecretSsmPath: '/app/environment/AWS_COGNITO_FACEBOOK_CLIENT_SECRET',
        },
        apple: {
          clientId: 'apple-app-client-id',
          teamId: 'apple-team-id',
          keyId: 'apple-key-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          privateKeySsmPath: '/app/environment/AWS_COGNITO_APPLE_PRIVATE_KEY',
        },
      },
      allowLocalhost: true,
    },
    storage: {
      enabled: true,
    },
    deploymentConfig: {
      subdomain: 'staging',
      publicDatabase: true,
    },
    plans: [
      {
        id: PlanId.BASIC,
        stripePriceId: 'stripe-price-id',
      },
    ],
    environmentVariables: {
      ...DEFAULT_ENVIRONMENT_VARIABLES,
      APP_DOMAIN: '${ssm:/my-app/staging/APP_DOMAIN}',
      DB_HOST: '${ssm:/my-app/staging/DB_HOST}',
      DB_PASSWORD: '${ssm:/my-app/staging/DB_PASSWORD}',
      DB_USERNAME: 'app',
      ENVIRONMENT: 'staging',
      FROM_EMAIL: coreConfig.fromEmail,
      LOG_LEVEL: 'info',
      REGION: coreConfig.aws.region,
      SIGNING_KEY: '${ssm:/my-app/staging/SIGNING_KEY}',
      STRIPE_KEY: '${ssm:/my-app/staging/STRIPE_KEY}',
      STRIPE_WEBHOOK_SECRET: '${ssm:/my-app/staging/STRIPE_WEBHOOK_SECRET}',
      TEST_CARD_ENABLED: '1',
      AWS_COGNITO_USER_POOL_ID: '${ssm:/my-app/staging/AWS_COGNITO_USER_POOL_ID',
      AWS_COGNITO_APP_CLIENT_ID: '${ssm:/my-app/staging/AWS_COGNITO_APP_CLIENT_ID',
      AWS_COGNITO_IDENTITY_POOL_ID: '${ssm:/volca/staging/AWS_COGNITO_IDENTITY_POOL_ID}',
    },
    // Optional, get your dsn from senty.io for error tracking
    // sentry: {
    //   webappDsn: '',
    //   apiDsn: '',
    // },
  },
  production: {
    authentication: {
      identityProviders: {
        google: {
          clientId: 'google-app-client-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          clientSecretSsmPath: '/app/environment/AWS_COGNITO_GOOGLE_CLIENT_SECRET',
        },
        facebook: {
          clientId: 'facebook-app-client-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          clientSecretSsmPath: '/app/environment/AWS_COGNITO_FACEBOOK_CLIENT_SECRET',
        },
        apple: {
          clientId: 'apple-app-client-id',
          teamId: 'apple-team-id',
          keyId: 'apple-key-id',
          // Replace this value with the path after you have uploaded the secret to SSM
          privateKeySsmPath: '/app/environment/AWS_COGNITO_APPLE_PRIVATE_KEY',
        },
      },
    },
    storage: {
      enabled: true,
    },
    deploymentConfig: {
      publicDatabase: true,
    },
    plans: [
      {
        id: PlanId.BASIC,
        stripePriceId: 'price-id',
      },
    ],
    environmentVariables: {
      ...DEFAULT_ENVIRONMENT_VARIABLES,
      APP_DOMAIN: '${ssm:/my-app/production/APP_DOMAIN}',
      DB_PASSWORD: '${ssm:/volca/production/DB_PASSWORD}',
      DB_USERNAME: 'postgres',
      DB_HOST: '${ssm:/volca/production/DB_HOST}',
      ENVIRONMENT: 'production',
      FROM_EMAIL: coreConfig.fromEmail,
      LOG_LEVEL: 'info',
      REGION: coreConfig.aws.region,
      SIGNING_KEY: '${ssm:/volca/production/SIGNING_KEY}',
      STRIPE_KEY: '${ssm:/volca/production/STRIPE_KEY}',
      STRIPE_WEBHOOK_SECRET: '${ssm:/volca/production/STRIPE_WEBHOOK_SECRET}',
      TEST_CARD_ENABLED: '1',
      AWS_COGNITO_USER_POOL_ID: '${ssm:/volca/production/AWS_COGNITO_USER_POOL_ID}',
      AWS_COGNITO_APP_CLIENT_ID: '${ssm:/volca/production/AWS_COGNITO_APP_CLIENT_ID}',
      AWS_COGNITO_IDENTITY_POOL_ID: '${ssm:/volca/production/AWS_COGNITO_IDENTITY_POOL_ID}',
    },
    // Optional, get your dsn from senty.io for error tracking
    // sentry: {
    //   webappDsn: '',
    //   apiDsn: '',
    // },
  },
};

export const config: Config = {
  ...coreConfig,
  environments,
};
