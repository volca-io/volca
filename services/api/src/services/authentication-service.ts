import { injectable, inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { DI_TYPES } from '../types/dependency-injection';
import {
  AccessTokenCookieSettings,
  AuthenticationService as AuthenticationServiceInterface,
  Security,
  UserService as UserServiceInterface,
} from '../interfaces';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { User } from '../entities';

@injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  public constructor(
    @inject(DI_TYPES.UserService) private userService: UserServiceInterface,
    @inject(DI_TYPES.Security) private security: Security
  ) {}

  public generateAccessToken(user: User): string {
    const payload = { sub: user.id };

    return this.security.createSignedToken(payload, '1d');
  }

  public getAccessTokenCookieSettings(): AccessTokenCookieSettings {
    return {
      secure: process.env.ENVIRONMENT !== 'local',
      httpOnly: true,
      sameSite: 'lax',
      domain: process.env.ENVIRONMENT === 'local' ? undefined : process.env.DOMAIN,
    };
  }

  public async verifyPassword(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new ServiceError({
        name: ErrorNames.AUTHENTICATION_FAILED,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'incorrect username or password',
        debug: 'Could not find a user for the given username',
      });
    }

    if (!user.password) {
      throw new ServiceError({
        name: ErrorNames.AUTHENTICATION_FAILED,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'incorrect username or password',
        debug: 'The user does not have a configured password',
      });
    }

    const match = await this.security.verifyPassword(user.password, password);

    if (!match) {
      throw new ServiceError({
        name: ErrorNames.AUTHENTICATION_FAILED,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'incorrect username or password',
        debug: 'The password was incorrect',
      });
    }

    return user;
  }
}
