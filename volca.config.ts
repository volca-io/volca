import { VolcaConfig, StackStrategy } from './config';

export const config: VolcaConfig = {
  name: 'volca',
  environments: {
    staging: {
      domain: 'staging.volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
    demo: {
      domain: 'demo.volca.io',
      aws: {
        account: '428245413678',
        region: 'eu-central-1',
        stackStrategy: StackStrategy.COST,
      },
    },
  },
};
