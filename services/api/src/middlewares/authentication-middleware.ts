import Koa from 'koa';
import * as Sentry from '@sentry/node';
import { StatusCodes } from 'http-status-codes';
import { CustomContext } from '../types';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { EnvironmentConfig } from '../utils/environment';

export const authenticationMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  const {
    request: {
      header: { authorization },
    },
    dependencies: {
      services: { authenticationService, userService },
    },
  } = ctx;

  if (!authorization) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Request is missing authorization header',
      debug: 'No authorization header existed on the request',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  if (!authorization.startsWith('Bearer ')) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Invalid token type, authorization header should start with "Bearer ..."',
      debug: 'Authorization header did not start with "Bearer "',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const token = authorization.replace('Bearer ', '');

  const tokenPayload = await authenticationService.verifyAccessToken({ token });
  const subject = tokenPayload.sub;

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

  ctx.user = user;

  await next();
};
