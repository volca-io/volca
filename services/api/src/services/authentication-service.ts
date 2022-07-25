import { injectable, inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { v4 as uuid } from 'uuid';
import { DI_TYPES } from '../types/dependency-injection';
import {
  AccessTokenCookieSettings,
  AuthenticationService as AuthenticationServiceInterface,
  Security,
  UserService as UserServiceInterface,
  AccessTokenResponse,
  SessionResponse,
} from '../interfaces';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { RefreshToken, User } from '../entities';

@injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  public constructor(
    @inject(DI_TYPES.UserService) private userService: UserServiceInterface,
    @inject(DI_TYPES.Security) private security: Security
  ) {}

  public async createNewSession(user: User): Promise<SessionResponse> {
    const sessionId = uuid();

    const { accessToken, expiresIn } = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, sessionId);

    return { accessToken, refreshToken, expiresIn };
  }

  private generateAccessToken(user: User): AccessTokenResponse {
    const payload = { sub: user.id };

    const expiresIn = 60 * 15; // 15 minutes
    const accessToken = this.security.createAccessToken(payload, expiresIn);

    return { accessToken, expiresIn };
  }

  public async generateRefreshToken(user: User, sessionId: string): Promise<string> {
    const token = this.security.createRefreshToken();
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + 60 * 60 * 24 * 365); // 1 year

    await RefreshToken.query().insert({
      sessionId,
      subject: user.id,
      token,
      expiresAt,
    });

    return token;
  }

  public async refreshToken(token: string): Promise<AccessTokenResponse> {
    const res = await RefreshToken.query().findOne({ token });
    if (!res) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Invalid or missing refresh token',
        statusCode: StatusCodes.UNAUTHORIZED,
        debug: 'The attached refresh token does not exist',
      });
    }

    if (res.expiresAt < new Date()) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Expired refresh token',
        statusCode: StatusCodes.UNAUTHORIZED,
        debug: 'The attached refresh token is expired',
      });
    }

    const user = await this.userService.findById(res.subject);
    if (!user) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'User does not exist',
        statusCode: StatusCodes.UNAUTHORIZED,
        debug: 'The user specified in the refresh token does not exist',
      });
    }

    return this.generateAccessToken(user);
  }

  public getRefreshTokenCookieConfiguration(): AccessTokenCookieSettings {
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
