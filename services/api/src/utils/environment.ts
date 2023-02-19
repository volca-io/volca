import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { EnvironmentVariable } from '../../../../config/types';
import { ErrorNames } from '../constants';
import { ServiceError } from '../errors/service-error';

@singleton()
export class EnvironmentUtils {
  getOrFail(key: EnvironmentVariable): string {
    const value = this.get(key);

    if (!value) {
      throw new ServiceError({
        name: ErrorNames.ENVIRONMENT_ERROR,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'An unexpected error occurred',
        debug: `Missing value for environment variable with key ${key}`,
      });
    }

    return value;
  }

  get(key: EnvironmentVariable): string | undefined {
    return process.env[key];
  }

  getWebappDomain(): string {
    return this.getOrFail(EnvironmentVariable.ENVIRONMENT) === 'local'
      ? 'http://127.0.0.1:3000'
      : `https://${this.getOrFail(EnvironmentVariable.APP_DOMAIN)}`;
  }
}

export { EnvironmentVariable } from '../../../../config/types';
