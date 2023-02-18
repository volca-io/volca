import { config } from '../../volca.config';

export enum Environment {
  LOCAL = 'local',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

type EnvironmentConfig = {
  [env in Environment]: Record<string, string>;
};

export const environments: EnvironmentConfig = {
  local: {
    HOST: '127.0.0.1',
    PORT: '3000',
    REACT_APP_API_URL: 'http://127.0.0.1:4000/',
    REACT_APP_STRIPE_TEST_MODE: config.environments.staging.testCardEnabled ? 'true' : 'false',
  },
  staging: {
    REACT_APP_API_URL: `https://api.${config.environments.staging.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.staging.testCardEnabled ? 'true' : 'false',
  },
  production: {
    REACT_APP_API_URL: `https://api.${config.environments.production.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.staging.testCardEnabled ? 'true' : 'false',
  },
};
