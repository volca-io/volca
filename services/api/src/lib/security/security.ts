import { injectable } from 'tsyringe';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { EnvironmentUtils, EnvironmentVariable } from '../../utils/environment';

@injectable()
export class Security {
  private signingKey: string;

  public constructor(private environment: EnvironmentUtils) {
    this.signingKey = this.environment.getOrFail(EnvironmentVariable.SIGNING_KEY);
  }

  public verifyPassword(hash: string, plain: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }

  public hashPassword(password: string): string {
    return bcrypt.hashSync(password);
  }

  public createTokenWithSecret(
    payload: Record<string, unknown>,
    expiresIn: string | number | undefined,
    secret: string
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  public verifyTokenWithSecret(token: string, secret: string) {
    jwt.verify(token, secret);
  }

  public createAccessToken(payload: Record<string, unknown>, expiresIn: string | number | undefined): string {
    return jwt.sign(payload, this.signingKey, { expiresIn });
  }

  public createRefreshToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  public verifyToken(token: string): JwtPayload {
    try {
      const result = jwt.verify(token, this.signingKey);

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
