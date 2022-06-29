import { StatusCodes } from 'http-status-codes';
import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { UserService } from '../interfaces';
import { ServiceError } from 'src/errors/service-error';

export const register = async (ctx: CustomContext) => {
  const {
    request: {
      body: { firstName, lastName, email, password },
    },
  } = ctx;

  const userService = container.get<UserService>(DI_TYPES.UserService);

  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    throw new ServiceError({ message: 'User already exists', statusCode: StatusCodes.CONFLICT });
  }

  const res = await userService.register({
    firstName,
    lastName,
    email,
    password,
  });

  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    result: res,
  });
};
