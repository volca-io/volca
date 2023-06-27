import { EnvironmentVariables } from '../services/api/src/utils/environment';

interface AwsConfig {
  account: string;
  region:
    | 'us-east-1'
    | 'us-east-2'
    | 'us-gov-east-1'
    | 'us-gov-west-1'
    | 'us-iso-east-1'
    | 'us-iso-west-1'
    | 'us-isob-east-1'
    | 'us-west-1'
    | 'us-west-2'
    | 'af-south-1'
    | 'ap-east-1'
    | 'ap-northeast-1'
    | 'ap-northeast-2'
    | 'ap-northeast-3'
    | 'ap-south-1'
    | 'ap-southeast-1'
    | 'ap-southeast-2'
    | 'ap-southeast-3'
    | 'ca-central-1'
    | 'cn-north-1'
    | 'cn-northwest-1'
    | 'eu-central-1'
    | 'eu-north-1'
    | 'eu-south-1'
    | 'eu-west-1'
    | 'eu-west-2'
    | 'eu-west-3'
    | 'me-south-1'
    | 'sa-east-1';
}

export enum EnvironmentVariable {
  APP_DOMAIN = 'APP_DOMAIN',
  DB_HOST = 'DB_HOST',
  DB_PASSWORD = 'DB_PASSWORD',
  DB_PORT = 'DB_PORT',
  DB_USERNAME = 'DB_USERNAME',
  ENVIRONMENT = 'ENVIRONMENT',
  FROM_EMAIL = 'FROM_EMAIL',
  IS_TEST = 'IS_TEST',
  LOG_LEVEL = 'LOG_LEVEL',
  LOGGING_ENABLED = 'LOGGING_ENABLED',
  REGION = 'REGION',
  SIGNING_KEY = 'SIGNING_KEY',
  SKIP_TOKEN_VERIFICATION = 'SKIP_TOKEN_VERIFICATION',
  STRIPE_KEY = 'STRIPE_KEY',
  STRIPE_WEBHOOK_SECRET = 'STRIPE_WEBHOOK_SECRET',
  TEST_CARD_ENABLED = 'TEST_CARD_ENABLED',
  FREE_TRIAL_DAYS = 'FREE_TRIAL_DAYS',
  AWS_COGNITO_USERPOOL_ID = 'AWS_COGNITO_USERPOOL_ID',
  AWS_COGNITO_APP_CLIENT_ID = 'AWS_COGNITO_APP_CLIENT_ID',
}

type OptionalVariables = Extract<
  EnvironmentVariable,
  EnvironmentVariable.AWS_COGNITO_USERPOOL_ID | EnvironmentVariable.AWS_COGNITO_APP_CLIENT_ID
>;

type RequiredVariables = Exclude<EnvironmentVariable, OptionalVariables>;

export type EnvironmentVariables = Record<RequiredVariables, string> & Partial<Record<OptionalVariables, string>>;

export type AuthenticationConfig = {
  identityProviders?: {
    facebook?:
      | {
          clientId: string;
          clientSecret: string;
          clientSecretSsmPath?: never;
        }
      | {
          clientId: string;
          clientSecret?: never;
          clientSecretSsmPath: string;
        }
      | Record<string, never>;
    google?:
      | {
          clientId: string;
          clientSecret: string;
          clientSecretSsmPath?: never;
        }
      | {
          clientId: string;
          clientSecret?: never;
          clientSecretSsmPath: string;
        }
      | Record<string, never>;
    apple?:
      | {
          clientId: string;
          teamId: string;
          keyId: string;
          privateKey: string;
          privateKeySsmPath?: never;
        }
      | {
          clientId: string;
          teamId: string;
          keyId: string;
          privateKey?: never;
          privateKeySsmPath: string;
        }
      | Record<string, never>;
  };
  loginDomain?: string;
  allowLocalhost?: boolean;
  mockUser?: {
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export enum PlanId {
  BASIC = 'BASIC',
  PLUS = 'PLUS',
  PREMIUM = 'PREMIUM',
}

type Plan = {
  id: PlanId;
  stripePriceId: string;
};

export interface EnvironmentConfig {
  environmentVariables: EnvironmentVariables;
  plans: Plan[];
  authentication: AuthenticationConfig;
  deploymentConfig?: {
    subdomain?: string;
    publicDatabase: boolean;
  };
}

type GithubConfig = {
  organization: string;
  repository: string;
};

export enum Environment {
  LOCAL = 'local',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export type Environments = {
  [env in Environment]: EnvironmentConfig;
};

export type Config = {
  name: string;
  github: GithubConfig;
  aws: AwsConfig;
  domain: string;
  fromEmail: string;
  environments: Environments;
};
