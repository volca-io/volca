import { injectable } from 'tsyringe';

import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { EnvironmentVariables } from '../../utils/environment';

type CreateTokenProperties = {
  payload: Record<string, unknown>;
  expiresIn: string | number;
  secret?: string;
};

type VerifyTokenProperties = {
  token: string;
  secret?: string;
};

@injectable()
export class Security {
  public verifyPassword(hash: string, plain: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  public hashPassword(password: string): string {
    return bcrypt.hashSync(password);
  }

  public createToken({ payload, expiresIn, secret }: CreateTokenProperties): string {
    return jwt.sign(payload, secret || EnvironmentVariables.SIGNING_KEY, { expiresIn });
  }

  public createRefreshToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  public verifyToken({ token, secret }: VerifyTokenProperties): JwtPayload {
    try {
      const result = jwt.verify(token, secret || EnvironmentVariables.SIGNING_KEY);

      if (typeof result !== 'object') {
        throw new ServiceError({
          name: ErrorNames.INTERNAL_SERVER_ERROR,
          message: 'Token validation failed',
          debug: `Token verification did not return an object. Returned type was ${typeof result}`,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
      }

      return result;
    } catch (error: unknown) {
      if (!(error instanceof Error)) {
        throw error;
      }

      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Token validation failed',
        debug: error.message,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
  }

  public decodeToken(token: string): JwtPayload {
    const decoded = jwt.decode(token);

    if (!decoded) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Token validation failed',
        debug: 'Unable to decode token',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    if (typeof decoded !== 'object') {
      throw new ServiceError({
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: 'Token validation failed',
        debug: `Token verification did not return an object. Returned type was ${typeof decoded}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
    return decoded as JwtPayload;
  }
}
