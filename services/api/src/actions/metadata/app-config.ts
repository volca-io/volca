import joi, { Schema } from 'joi';
import jwt from 'jsonwebtoken';
import { config, EnvironmentConfig, EnvironmentVariables } from '../../utils/environment';

import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  message: joi.string().required(),
});

export const action = useApiAction(async () => {
  return {
    body: {
      stripeTestCardEnabled: EnvironmentVariables.TEST_CARD_ENABLED === '1',
      awsRegion: config.aws.region,
      // Use the hardcoded login domain if there is one in the config, otherwise resolve it from the domain config.
      // This will allow us to sign in locally with Cognito deployed for staging
      awsCognitoLoginDomain:
        EnvironmentConfig.authentication.loginDomain ||
        (EnvironmentConfig.deploymentConfig?.subdomain
          ? `login.${EnvironmentConfig.deploymentConfig?.subdomain}.${config.domain}`
          : `login.${config.domain}`),
      awsCognitoUserpoolId: EnvironmentVariables.AWS_COGNITO_USER_POOL_ID,
      awsCognitoIdentityPoolId: EnvironmentVariables.AWS_COGNITO_IDENTITY_POOL_ID,
      awsCognitoAppClientId: EnvironmentVariables.AWS_COGNITO_APP_CLIENT_ID,
      awsS3AssetBucket: EnvironmentVariables.AWS_S3_ASSETS_BUCKET,
      identityProviders: {
        facebook: !!EnvironmentConfig.authentication.identityProviders?.facebook,
        google: !!EnvironmentConfig.authentication.identityProviders?.google,
        apple: !!EnvironmentConfig.authentication.identityProviders?.apple,
      },
      ...(EnvironmentConfig.authentication.mockUser
        ? {
            mockTokens: {
              accessToken: jwt.sign(
                {
                  sub: EnvironmentConfig.authentication.mockUser.sub,
                },
                'mock-token'
              ),
              idToken: jwt.sign(
                {
                  sub: EnvironmentConfig.authentication.mockUser.sub,
                  given_name: EnvironmentConfig.authentication.mockUser.firstName,
                  family_name: EnvironmentConfig.authentication.mockUser.lastName,
                  email: EnvironmentConfig.authentication.mockUser.email,
                },
                'mock-token'
              ),
            },
          }
        : {}),
    },
  };
});
