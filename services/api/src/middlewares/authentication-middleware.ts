import Koa from 'koa';
import { CustomContext } from '../types';
import { container } from 'tsyringe';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';
import { Security } from '../lib/security/security';

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

  const security = container.resolve(Security);

  if (!header.startsWith('Bearer ')) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Invalid token type, authorization header should start with "Bearer ..."',
      debug: 'Authorization header did not start with "Bearer "',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const token = header.replace('Bearer ', '');
  try {
    const { sub } =
      process.env.SKIP_TOKEN_VERIFICATION === 'true' ? security.decodeToken(token) : security.verifyToken(token);

    if (!sub) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'Subject missing from token',
        debug: 'The token did not include a subject',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const userService = container.resolve(UserService);
    const user = await userService.findById(sub);

    if (!user) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'User not found',
        debug: 'Unable to find matching user to token subject',
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    ctx.user = user;
  } catch (error: unknown) {
    let message = 'unknown';
    if (error instanceof Error) {
      message = error.message;
    }

    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Invalid token',
      debug: message,
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  await next();
};
