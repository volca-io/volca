import { Config, StackStrategy } from './types/volca';

export const config: Config = {
  name: 'volca',
  github: {
    organization: 'okarlsson',
    repository: 'volca',
  },
  environments: {
    local: null,
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
