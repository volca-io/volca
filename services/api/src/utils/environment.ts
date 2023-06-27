import { Environments } from '../../../../config/types';
import { config } from '../../../../app.config';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { StatusCodes } from 'http-status-codes';
export { config } from '../../../../app.config';

const Environment = process.env.ENVIRONMENT as keyof Environments;

export const EnvironmentConfig = config.environments[Environment];

export const EnvironmentVariables =
  Environment === 'local'
    ? EnvironmentConfig.environmentVariables
    : Object.keys(EnvironmentConfig.environmentVariables).reduce((all, one) => {
        if (!process.env[one]) {
          throw new ServiceError({
            name: ErrorNames.ENVIRONMENT_ERROR,
            message: `Failed to resolve environment variable for ${one}`,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          });
        }

        return {
          ...all,
          [one]: process.env[one],
        };
      }, EnvironmentConfig.environmentVariables);
