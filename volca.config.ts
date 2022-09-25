import { Config, StackStrategy } from './types/volca';

export const config: Config = {
  name: 'volca',
  github: {
    organization: 'volca-io',
    repository: 'volca',
  },
  environments: {
    local: {
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
    staging: {
      domain: 'staging.volca.io',
      fromEmail: 'admin@volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
    production: {
      domain: 'demo.volca.io',
      fromEmail: 'admin@volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
  },
};
