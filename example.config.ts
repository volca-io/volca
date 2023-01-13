import { Config } from './types/volca';

export const config: Config = {
  name: 'my-app',
  fromEmail: 'my@email.com',
  github: {
    organization: 'my-github-org',
    repository: 'my-github-repo',
  },
  environments: {
    staging: {
      domain: 'staging.example.com',
      aws: {
        publicDatabase: true,
        account: '000000000000',
        region: 'us-east-1',
      },
    },
    production: {
      domain: 'prod.example.com',
      aws: {
        // Note: Using a private database will deploy a NAT gateway that costs ~$30 / month
        // read more here: https://aws.amazon.com/vpc/pricing/
        publicDatabase: false,
        account: '000000000000',
        region: 'us-east-1',
      },
    },
  },
};
