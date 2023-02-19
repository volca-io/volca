import { Config } from './config/types';
import { DEFAULT_ENVIRONMENT_VARIABLES, getEnvVar } from './config/utils';

export const config: Config = {
  name: 'volca',
  github: {
    organization: 'volca-io',
    repository: 'volca',
  },
  environments: {
    local: {
      environmentVariables: {
        ...DEFAULT_ENVIRONMENT_VARIABLES,
        APP_DOMAIN: getEnvVar('APP_DOMAIN', '127.0.0.1:3000'),
        DB_PASSWORD: getEnvVar('PASSWORD', 'postgres'),
        DB_USERNAME: getEnvVar('USERNAME', 'postgres'),
        ENVIRONMENT: 'local',
        FROM_EMAIL: getEnvVar('FROM_EMAIL', 'noreply@example.com'),
        LOG_LEVEL: getEnvVar('LOG_LEVEL', 'debug'),
        SIGNING_KEY: getEnvVar('SIGNING_KEY', 'signing-key'),
        STRIPE_KEY: getEnvVar('STRIPE_KEY', 'stripe-key'),
        STRIPE_PRICE_ID: getEnvVar('STRIPE_PRICE_ID', 'stripe-price-id'),
        STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET', 'stripe-webhook-secret'),
        TEST_CARD_ENABLED: getEnvVar('TEST_CARD_ENABLED', '1'),
      },
    },
    staging: {
      deploymentConfig: {
        domain: 'staging.volca.io',
        aws: {
          account: '428245413678',
          region: 'eu-central-1',
          publicDatabase: true,
        },
      },
      environmentVariables: {
        ...DEFAULT_ENVIRONMENT_VARIABLES,
        APP_DOMAIN: '${ssm:/staging/APP_DOMAIN}',
        DB_PASSWORD: '${ssm:/staging/DB_PASSWORD}',
        DB_USERNAME: 'postgres',
        DB_HOST: '${ssm:/staging/DB_HOST}',
        ENVIRONMENT: 'staging',
        FROM_EMAIL: 'admin@volca.io',
        LOG_LEVEL: 'info',
        REGION: 'eu-central-1',
        SIGNING_KEY: '${ssm:/staging/SIGNING_KEY}',
        STRIPE_KEY: '${ssm:/staging/STRIPE_KEY}',
        STRIPE_PRICE_ID: 'price_1LsAQnK4oQ2oKqbP2lEUdYiU',
        STRIPE_WEBHOOK_SECRET: '${ssm:/staging/STRIPE_WEBHOOK_SECRET}',
        TEST_CARD_ENABLED: '1',
      },
    },
    production: {
      deploymentConfig: {
        domain: 'demo.volca.io',
        aws: {
          account: '428245413678',
          region: 'eu-central-1',
          publicDatabase: true,
        },
      },
      environmentVariables: {
        ...DEFAULT_ENVIRONMENT_VARIABLES,
        APP_DOMAIN: '${ssm:/production/APP_DOMAIN}',
        DB_PASSWORD: '${ssm:/production/DB_PASSWORD}',
        DB_USERNAME: 'postgres',
        DB_HOST: '${ssm:/production/DB_HOST}',
        ENVIRONMENT: 'production',
        FROM_EMAIL: 'admin@volca.io',
        LOG_LEVEL: 'info',
        REGION: 'eu-central-1',
        SIGNING_KEY: '${ssm:/production/SIGNING_KEY}',
        STRIPE_KEY: '${ssm:/production/STRIPE_KEY}',
        STRIPE_PRICE_ID: 'price_1LsAQnK4oQ2oKqbP2lEUdYiU',
        STRIPE_WEBHOOK_SECRET: '${ssm:/production/STRIPE_WEBHOOK_SECRET}',
        TEST_CARD_ENABLED: '1',
      },
    },
  },
};
