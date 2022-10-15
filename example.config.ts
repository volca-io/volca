import { Config } from './types/volca';

export const config: Config = {
  name: 'my-app',
  github: {
    organization: 'my-github-org',
    repository: 'my-github-repo',
  },
  environments: {
    local: {
      fromEmail: 'my@email.com',
      aws: {
        account: '000000000000',
        region: 'us-east-1',
      },
    },
    staging: {
      domain: 'staging.example.com',
      fromEmail: 'my@email.com',
      aws: {
        account: '000000000000',
        region: 'us-east-1',
      },
    },
    production: {
      domain: 'prod.example.com',
      fromEmail: 'my@email.com',
      aws: {
        account: '000000000000',
        region: 'us-east-1',
      },
    },
  },
};
