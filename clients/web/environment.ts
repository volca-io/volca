import { config } from '../../app.config';

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
    REACT_APP_STRIPE_TEST_MODE: config.environments.local.environmentVariables.TEST_CARD_ENABLED,
  },
  staging: {
    REACT_APP_API_URL: `https://api.${config.environments.staging.deploymentConfig?.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.staging.environmentVariables.TEST_CARD_ENABLED,
  },
  production: {
    REACT_APP_API_URL: `https://api.${config.environments.production.deploymentConfig?.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.production.environmentVariables.TEST_CARD_ENABLED,
  },
};
