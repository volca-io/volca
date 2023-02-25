import { Config } from './config/types';
import { DEFAULT_ENVIRONMENT_VARIABLES, getEnvVar } from './config/utils';

export const config: Config = {
  name: 'my-app',
  github: {
    organization: 'my-github-organization',
    repository: 'my-github-repository',
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
      },
    },
    staging: {
      deploymentConfig: {
        domain: 'staging.example.com',
        aws: {
          account: '000000000000',
          region: 'us-east-1',
          publicDatabase: true,
        },
      },
      environmentVariables: {
        ...DEFAULT_ENVIRONMENT_VARIABLES,
        APP_DOMAIN: '${ssm:/my-app/staging/APP_DOMAIN}',
        DB_HOST: '${ssm:/my-app/staging/DB_HOST}',
        DB_PASSWORD: '${ssm:/my-app/staging/DB_PASSWORD}',
        DB_USERNAME: 'app',
        ENVIRONMENT: 'staging',
        FROM_EMAIL: 'noreply@example.com',
        LOG_LEVEL: 'info',
        REGION: 'us-east-1',
        SIGNING_KEY: '${ssm:/my-app/staging/SIGNING_KEY}',
        STRIPE_KEY: '${ssm:/my-app/staging/STRIPE_KEY}',
        STRIPE_PRICE_ID: '',
        STRIPE_WEBHOOK_SECRET: '${ssm:/my-app/staging/STRIPE_WEBHOOK_SECRET}',
      },
    },
    production: {
      deploymentConfig: {
        domain: 'production.example.com',
        aws: {
          account: '000000000000',
          region: 'us-east-1',
          publicDatabase: true,
        },
      },
      environmentVariables: {
        ...DEFAULT_ENVIRONMENT_VARIABLES,
        APP_DOMAIN: '${ssm:/my-app/production/APP_DOMAIN}',
        DB_HOST: '${ssm:/my-app/production/DB_HOST}',
        DB_PASSWORD: '${ssm:/my-app/production/DB_PASSWORD}',
        DB_USERNAME: 'app',
        ENVIRONMENT: 'production',
        FROM_EMAIL: 'noreply@example.com',
        LOG_LEVEL: 'info',
        REGION: 'us-east-1',
        SIGNING_KEY: '${ssm:/my-app/production/SIGNING_KEY}',
        STRIPE_KEY: '${ssm:/my-app/production/STRIPE_KEY}',
        STRIPE_PRICE_ID: '',
        STRIPE_WEBHOOK_SECRET: '${ssm:/my-app/production/STRIPE_WEBHOOK_SECRET}',
      },
    },
  },
};
