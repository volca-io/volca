import { injectable } from 'inversify';
import argon2 from 'argon2';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import { Security as SecurityInterface } from '../../interfaces';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

interface SigningKey {
  kid: string;
  secret: string;
}

@injectable()
export class Security implements SecurityInterface {
  // TODO - This has to be moved to a config or a database
  public signingKeys = [
    {
      kid: '443985e5-f659-4374-8cff-b1b62ed5cc93',
      secret: 'b405204a081b33f6a0794765e68d91a638a72d78be47dd057fbcf286fa0b3885',
    },
  ] as Array<SigningKey>;

  public verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
  }

  public hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public createAccessToken(payload: Record<string, unknown>, expiresIn: string | number | undefined): string {
    const { kid, secret } = this.signingKeys[0];

    return jwt.sign(payload, secret, { expiresIn, keyid: kid });
  }

  public createRefreshToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }

  public verifyToken(token: string): JwtPayload {
    const { header } = this.decodeToken(token);

    const key = this.signingKeys.find((key) => key.kid === header.kid);

    if (!key) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Token validation failed',
        debug: `Unable to find a matching signing kid for kid ${header.kid}`,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const result = jwt.verify(token, key.secret);

    if (typeof result !== 'object') {
      throw new ServiceError({
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: 'Token validation failed',
        debug: `Token verification did not return an object. Returned type was ${typeof result}`,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }

    return result;
  }

  public decodeToken(token: string): Jwt {
    const decoded = jwt.decode(token, { complete: true });

    if (!decoded) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Token validation failed',
        debug: 'Unable to decode token',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    return decoded;
  }
}
