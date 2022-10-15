import { Config } from './types/volca';

export const config: Config = {
  name: 'volca',
  github: {
    organization: 'volca-io',
    repository: 'volca',
  },
  environments: {
    local: {
      fromEmail: 'admin@volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
      },
    },
    staging: {
      domain: 'staging.volca.io',
      fromEmail: 'admin@volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
      },
    },
    production: {
      domain: 'demo.volca.io',
      fromEmail: 'admin@volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
      },
    },
  },
};
