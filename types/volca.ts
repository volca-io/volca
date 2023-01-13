interface AwsConfig {
  account: string;
  publicDatabase: boolean;
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

export interface EnvironmentConfig {
  aws: AwsConfig;
  domain: string;
  testCardEnabled?: boolean;
}

type GithubConfig = {
  organization: string;
  repository: string;
};

export enum Environment {
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export type Config = {
  environments: {
    staging: EnvironmentConfig;
    production: EnvironmentConfig;
  };
  name: string;
  fromEmail: string;
  github: GithubConfig;
};
