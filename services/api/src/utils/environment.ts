import { config } from '../../../../app.config';
import { Environments } from '../../../../config/types';

const Environment = process.env.ENVIRONMENT as keyof Environments;

export const EnvironmentConfig = config.environments[Environment];

export const EnvironmentVariables =
  Environment === 'local'
    ? EnvironmentConfig.environmentVariables
    : Object.keys(EnvironmentConfig.environmentVariables).reduce(
        (all, one) => ({
          ...all,
          [one]: process.env[one],
        }),
        EnvironmentConfig.environmentVariables
      );
