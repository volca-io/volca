import 'reflect-metadata';

process.env = {
  ...process.env,
  APP_DOMAIN: '127.0.0.1:3000',
  DB_HOST: 'localhost',
  DB_PASSWORD: 'postgres',
  DB_PORT: '5432',
  DB_USERNAME: 'postgres',
  ENVIRONMENT: 'local',
  FROM_EMAIL: 'test@test.com',
  LOG_LEVEL: 'error',
  LOGGING_ENABLED: '0',
  REGION: 'local',
  SIGNING_KEY: 'signing-key',
  SKIP_TOKEN_VERIFICATION: '0',
  STRIPE_KEY: 'stripe-key',
  STRIPE_PRICE_ID: 'price-id',
  STRIPE_WEBHOOK_SECRET: 'stripe-webhook-secret',
};
