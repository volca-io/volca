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
    PORT: '3000',
    REACT_APP_API_URL: 'http://localhost:4000/',
  },
  staging: {
    REACT_APP_ENVIRONMENT: 'staging',
    ...(config.environments.staging.sentry
      ? { REACT_APP_SENTRY_DSN: config.environments.staging.sentry.webappDsn }
      : {}),
    REACT_APP_API_URL: config.environments.staging.deploymentConfig?.subdomain
      ? `https://api.${config.environments.staging.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
  },
  production: {
    REACT_APP_ENVIRONMENT: 'production',
    ...(config.environments.production.sentry
      ? { REACT_APP_SENTRY_DSN: config.environments.production.sentry.webappDsn }
      : {}),
    REACT_APP_API_URL: config.environments.production.deploymentConfig?.subdomain
      ? `https://api.${config.environments.production.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
  },
};
