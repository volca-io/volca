import Koa from 'koa';
import { CustomContext } from '../types';
import { container } from 'tsyringe';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { StatusCodes } from 'http-status-codes';
import * as Sentry from '@sentry/node';
import { AuthenticationService, UserService } from '../services';
import { User } from '../entities';
import { EnvironmentConfig } from '../utils/environment';

export const authenticationMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  const header = ctx.header.authorization;

  if (!header) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Request is missing authorization header',
      debug: 'No authorization header existed on the request',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  if (!header.startsWith('Bearer ')) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Invalid token type, authorization header should start with "Bearer ..."',
      debug: 'Authorization header did not start with "Bearer "',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const token = header.replace('Bearer ', '');
  const authService = container.resolve(AuthenticationService);

  const tokenPayload = await authService.verifyAccessToken({ token });
  const subject = tokenPayload.sub;

  const userService = container.resolve(UserService);
  const user = await userService.findByCognitoSubject(subject);

  if (!user) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'User not found',
      debug: 'Unable to find matching user to token subject',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  if (EnvironmentConfig.sentry) {
    Sentry.setUser({ id: user.id, email: user.email });
  }

  container.register<User>('AuthenticatedUser', {
    useValue: user,
  });

  await next();
};
