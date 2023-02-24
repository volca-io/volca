/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import { Environment } from '../../config/types';
import { config } from '../../app.config';

const resolveEnvironment = (): Environment => {
  const stage = process.env.STAGE || Environment.LOCAL;

  if (!Object.values<string>(Environment).includes(stage)) {
    throw new Error(`Unhandled stage ${stage}. Add the environment to your app.config.ts and try again`);
  }

  return stage as Environment;
};

const environment = resolveEnvironment();
const { deploymentConfig } = config.environments[environment];

const serverlessConfiguration: AWS = {
  service: `${config.name}-api`,
  frameworkVersion: '3',
  package: {
    individually: true,
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    iam: deploymentConfig
      ? {
          role: `\${cf:${config.name}-\${self:provider.stage}-api-stack.LambdaExecutionRole}`,
          deploymentRole: `\${cf:${config.name}-\${self:provider.stage}-devops-stack.ApiCloudformationDeploymentRoleArn}`,
        }
      : undefined,
    vpc:
      deploymentConfig?.aws.publicDatabase === false
        ? {
            securityGroupIds: [`\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiSecurityGroupOutput}`],
            subnetIds: {
              'Fn::Split': [', ', `\${cf:${config.name}-\${self:provider.stage}-vpc-stack.PrivateSubnets}`],
            },
          }
        : undefined,
    stackName: `${config.name}-${environment}-api-service`,
    runtime: 'nodejs16.x',
    versionFunctions: false,
    stage: environment,
    region: deploymentConfig ? deploymentConfig.aws.region : undefined,
    apiGateway: deploymentConfig
      ? {
          restApiId: `\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiGatewayID}`,
          restApiRootResourceId: `\${cf:${config.name}-\${self:provider.stage}-api-stack.ApiGatewayRootResourceID}`,
        }
      : undefined,
    environment: config.environments[environment].environmentVariables,
  },
  custom: {
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
