import { config } from '@project/config';

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
    VITE_API_URL: 'http://localhost:4000/',
  },
  staging: {
    VITE_ENVIRONMENT: 'staging',
    ...(config.environments.staging.sentry ? { VITE_SENTRY_DSN: config.environments.staging.sentry.dashboardDsn } : {}),
    VITE_API_URL: config.environments.staging.deploymentConfig?.subdomain
      ? `https://api.${config.environments.staging.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
  },
  production: {
    VITE_ENVIRONMENT: 'production',
    ...(config.environments.production.sentry
      ? { VITE_SENTRY_DSN: config.environments.production.sentry.dashboardDsn }
      : {}),
    VITE_API_URL: config.environments.production.deploymentConfig?.subdomain
      ? `https://api.${config.environments.production.deploymentConfig?.subdomain}.${config.domain}/`
      : `https://api.${config.domain}/`,
  },
};
