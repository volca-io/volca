import Koa from 'koa';
import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { Security } from '../interfaces';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../services';

export const authenticationMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  const token = ctx.cookies.get('x-access-token');

  if (!token) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Request is missing access token cookie',
      debug: 'No access token cookie was included in the request',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const security = container.get<Security>(DI_TYPES.Security);

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

    const userService = container.get<UserService>(DI_TYPES.UserService);
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
