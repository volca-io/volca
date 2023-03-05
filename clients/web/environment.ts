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
    REACT_APP_API_URL: config.environments.staging.deploymentConfig?.subdomain
      ? `https://api.${config.environments.staging.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.staging.environmentVariables.TEST_CARD_ENABLED,
  },
  production: {
    REACT_APP_API_URL: config.environments.production.deploymentConfig?.subdomain
      ? `https://api.${config.environments.production.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
    REACT_APP_STRIPE_TEST_MODE: config.environments.production.environmentVariables.TEST_CARD_ENABLED,
  },
};
