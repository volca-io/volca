/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import { Environment } from '../../types/volca';
import { config } from '../../volca.config';

enum OfflineEnvironment {
  LOCAL = 'local'
}

type Environments = OfflineEnvironment | Environment


type EnvironmentVariables = {
  logLevel: string;
  appDomain: string;
  fromEmail: string;
  skipTokenVerification: string;
  testCardEnabled: string;
  isTest?: string;
  credentials:
    | {
        host: string;
        port: string;
        username: string;
        password: string;
        stripePriceId: string;
        stripeKey: string;
        stripeWebhookSecret: string;
        signingKey: string;
      }
    | string;
};

const getEnvVar = (envVar: string, defaultValue?: string): string => {
  const variable = process.env[envVar] || defaultValue;
  if (!variable) throw new Error(`Failed to read environment variable ${envVar}`);

  return variable;
};

const getEnvironment = (stage: Environments): EnvironmentVariables => {
  switch (stage) {
    case OfflineEnvironment.LOCAL:
      return {
        logLevel: getEnvVar('LOG_LEVEL', 'info'),
        appDomain: getEnvVar('APP_DOMAIN', '127.0.0.1:3000'),
        skipTokenVerification: getEnvVar('SKIP_TOKEN_VERIFICATION', 'false'),
        fromEmail: config.fromEmail,
        testCardEnabled: getEnvVar('TEST_CARD_ENABLED', 'true'),
        credentials: {
          host: getEnvVar('DB_HOST', 'localhost'),
          port: getEnvVar('DB_PORT', '5432'),
          username: getEnvVar('DB_USER', 'postgres'),
          password: getEnvVar('DB_PASSWORD', 'postgres'),
          stripePriceId: getEnvVar('STRIPE_PRICE_ID', 'stripe-price-id'),
          stripeKey: getEnvVar('STRIPE_KEY', 'stripe-key'),
          stripeWebhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', 'stripe-webhook-secret'),
          signingKey: getEnvVar('SIGNING_KEY', 'signing-key'),
        },
      };
    default: {
      const envConfig = config.environments[stage]
      return {
        logLevel: 'info',
        appDomain: `\${cf:${config.name}-${stage}-webapp-stack.AppDomain}`,
        credentials: `\${ssm:/aws/reference/secretsmanager/${config.name}-${stage}-api-credentials}`,
        skipTokenVerification: 'false',
        fromEmail: config.fromEmail,
        testCardEnabled: envConfig.testCardEnabled ? 'true' : 'false',
      };
    }
  }
};

const resolveEnvironment = (): Environments => {
  const stage = process.env.STAGE || OfflineEnvironment.LOCAL;

  if (!Object.values<string>(Environment).includes(stage) && !Object.values<string>(OfflineEnvironment).includes(stage) ) {
    throw new Error(`Unhandled stage ${stage}. Add the environment to your volca.config.ts and try again`);
  }

  return stage as Environments;
};

const environment = resolveEnvironment();

const serverlessConfiguration: AWS = {
  service: `${config.name}-api`,
  frameworkVersion: '3',
  useDotenv: true,
  package: {
    individually: true,
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    iam:
    environment !== OfflineEnvironment.LOCAL
        ? {
            role: `\${cf:${config.name}-\${self:provider.stage}-api-stack.LambdaExecutionRole}`,
            deploymentRole: `\${cf:${config.name}-\${self:provider.stage}-devops-stack.ApiCloudformationDeploymentRoleArn}`,
          }
        : undefined,
    vpc:
      environment !== OfflineEnvironment.LOCAL && !config.environments[environment].aws.publicDatabase
        ? {
            securityGroupIds: [`\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiSecurityGroupOutput}`],
            subnetIds: {
              'Fn::Split': [', ', `\${cf:${config.name}-\${self:provider.stage}-vpc-stack.IsolatedSubnets}`],
            },
          }
        : undefined,
    stackName: `${config.name}-${environment}-api-service`,
    runtime: 'nodejs16.x',
    stage: environment,
    region: environment === OfflineEnvironment.LOCAL ? undefined : config.environments[environment].aws.region,
    apiGateway:
    environment !== OfflineEnvironment.LOCAL
        ? {
            restApiId: `\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiGatewayID}`,
            restApiRootResourceId: `\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiGatewayRootResourceID}`,
          }
        : undefined,
    environment: {
      STAGE: environment,
      REGION: '${self:provider.region, "local"}',
      LOG_LEVEL: '${self:custom.environment.logLevel}',
      APP_DOMAIN: '${self:custom.environment.appDomain}',
      DB_HOST: '${self:custom.environment.credentials.host}',
      DB_USER: '${self:custom.environment.credentials.username}',
      DB_PASSWORD: '${self:custom.environment.credentials.password}',
      DB_PORT: '${self:custom.environment.credentials.port}',
      SKIP_TOKEN_VERIFICATION: '${self:custom.environment.skipTokenVerification}',
      STRIPE_PRICE_ID: '${self:custom.environment.credentials.stripePriceId}',
      STRIPE_KEY: '${self:custom.environment.credentials.stripeKey}',
      STRIPE_WEBHOOK_SECRET: '${self:custom.environment.credentials.stripeWebhookSecret}',
      FROM_EMAIL: '${self:custom.environment.fromEmail}',
      SIGNING_KEY: '${self:custom.environment.credentials.signingKey}',
      TEST_CARD_ENABLED: '${self:custom.environment.testCardEnabled}',
    },
  },
  custom: {
    environment: getEnvironment(environment),
    'serverless-offline': {
      httpPort: 4000,
      noPrependStageInUrl: true,
    },
    webpack: {
      webpackConfig: 'webpack.config.js',
      excludeFiles: 'src/**/*.test.js',
      includeModules: {
        forceInclude: ['pg'],
        forceExclude: [
          'tedious',
          'mysql',
          'mysql2',
          'better-sqlite3',
          'oracledb',
          'pg-query-stream',
          'sqlite3',
          'pg-native',
          'better-sqlite3',
          'mysql',
        ],
      },
    },
  },
  functions: {
    api: {
      handler: 'src/lambda-handlers/api.handler',
      memorySize: 1024,
      events: [
        {
          http: {
            path: '{proxy+}',
            method: 'any',
          },
        },
      ],
    },
    migrate: {
      handler: 'src/lambda-handlers/migrate.handler',
    },
    seed: {
      handler: 'src/lambda-handlers/seeder.handler',
    },
  },
};

module.exports = serverlessConfiguration;
