import { StatusCodes } from 'http-status-codes';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import jwt from 'jsonwebtoken';
import { EnvironmentConfig, EnvironmentVariables, config } from '../utils/environment';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { CognitoAccessTokenPayload, CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { CognitoIdentityClient, GetIdCommand } from '@aws-sdk/client-cognito-identity';

export class AuthenticationService {
  private getVerifier(tokenUse: 'access' | 'id') {
    if (EnvironmentConfig.authentication.mockUser) {
      return {
        verify: (token: string) => {
          return jwt.decode(token);
        },
      };
    }

    const userPoolId = EnvironmentVariables.AWS_COGNITO_USER_POOL_ID;
    const clientId = EnvironmentVariables.AWS_COGNITO_APP_CLIENT_ID;

    if (!userPoolId) {
      throw new ServiceError({
        name: ErrorNames.ENVIRONMENT_ERROR,
        message: 'Missing required environment variable',
        debug: 'A cognito user pool id was not set in your environment, make sure to add it yo your app config',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    if (!clientId) {
      throw new ServiceError({
        name: ErrorNames.ENVIRONMENT_ERROR,
        message: 'Missing required environment variable',
        debug: 'A cognito app client id was not set in your environment, make sure to add it yo your app config',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return CognitoJwtVerifier.create({
      userPoolId,
      tokenUse,
      clientId,
    });
  }

  public async verifyAccessToken({ token }: { token: string }) {
    const verifier = this.getVerifier('access');
    try {
      return verifier.verify(token) as Promise<CognitoAccessTokenPayload>;
    } catch {
      throw new ServiceError({
        name: ErrorNames.AUTHENTICATION_FAILED,
        message: 'Authentication failed',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
  }

  public async verifyIdToken({ token }: { token: string }) {
    const verifier = this.getVerifier('id');

    try {
      return verifier.verify(token) as Promise<CognitoIdTokenPayload>;
    } catch {
      throw new ServiceError({
        name: ErrorNames.AUTHENTICATION_FAILED,
        message: 'Authentication failed',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
  }

  public async getIdentityId({ token }: { token: string }): Promise<string> {
    if (EnvironmentConfig.authentication.mockUser) {
      return EnvironmentConfig.authentication.mockUser.sub;
    }
    const region = config.aws.region;
    const client = new CognitoIdentityClient({ region });
    const identityPoolId = EnvironmentVariables.AWS_COGNITO_IDENTITY_POOL_ID;
    const userPoolId = EnvironmentVariables.AWS_COGNITO_USER_POOL_ID;

    const { IdentityId } = await client.send(
      new GetIdCommand({
        IdentityPoolId: identityPoolId,
        Logins: {
          [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: token,
        },
      })
    );

    if (!IdentityId) {
      throw new ServiceError({
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: 'Authentication failed',
        debug: 'Got undefined identity id for user',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return IdentityId;
  }
}
