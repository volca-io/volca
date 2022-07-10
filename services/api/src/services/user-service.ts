import { injectable, inject } from 'inversify';
import { StatusCodes } from 'http-status-codes';

import { DI_TYPES } from '../types';
import { UserService as UserServiceInterface, Security } from '../interfaces';
import { User } from '../entities';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

interface RegisterUserProperties {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@injectable()
export class UserService implements UserServiceInterface {
  public constructor(@inject(DI_TYPES.Security) private security: Security) {}

  public async findById(id: string): Promise<User | undefined> {
    return User.query().findById(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return User.query().where({ email }).first();
  }

  public async register({ firstName, lastName, email, password }: RegisterUserProperties): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ServiceError({
        name: ErrorNames.USER_ALREADY_EXISTS,
        message: 'User already exists',
        statusCode: StatusCodes.CONFLICT,
        debug: 'A user with this username already exists',
      });
    }

    const hashedPassword = await this.security.hashPassword(password);

    const user = await User.query().insert({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
