import { Config } from './types/volca';

export const config: Config = {
  name: 'volca',
  github: {
    organization: 'volca-io',
    repository: 'volca',
  },
  fromEmail: 'admin@volca.io',
  environments: {
    staging: {
      domain: 'staging.volca.io',
      testCardEnabled: true,
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        publicDatabase: true,
      },
    },
    production: {
      domain: 'demo.volca.io',
      testCardEnabled: true,
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        publicDatabase: true,
      },
    },
  },
};
