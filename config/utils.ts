import * as dotenv from 'dotenv';
import * as path from 'path';
import { EnvironmentVariable } from './types';

dotenv.config({ path: path.join(__dirname, '../.env') });

export const getEnvVar = (envVar: string, defaultValue?: string): string => {
  const variable = process.env[envVar] || defaultValue;
  if (!variable) throw new Error(`Failed to read environment variable ${envVar}`);

  return variable;
};

export const DEFAULT_ENVIRONMENT_VARIABLES = {
  [EnvironmentVariable.DB_HOST]: 'localhost',
  [EnvironmentVariable.DB_PORT]: '5432',
  [EnvironmentVariable.IS_TEST]: '0',
  [EnvironmentVariable.SKIP_TOKEN_VERIFICATION]: '0',
  [EnvironmentVariable.TEST_CARD_ENABLED]: '0',
  [EnvironmentVariable.LOGGING_ENABLED]: '1',
  [EnvironmentVariable.FREE_TRIAL_DAYS]: '7',
} as const;
