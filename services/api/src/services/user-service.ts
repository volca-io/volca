import { StatusCodes } from 'http-status-codes';
import { injectable, container } from 'tsyringe';

import { User } from '../entities';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Security } from '../lib/security/security';

type RegisterUserProperties = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UpdateUserProperties = {
  id: string;
  stripeId?: string;
  hasActiveSubscription?: boolean;
  freeTrialActivated?: boolean;
};

@injectable()
export class UserService {
  public constructor(private security: Security) {
    this.security = container.resolve(Security);
  }

  public async findById(id: string): Promise<User | undefined> {
    return User.query().findById(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return User.query().where({ email }).first();
  }

  public async findByStripeId(stripeId: string): Promise<User | undefined> {
    return User.query().where({ stripeId }).first();
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

  public async update({ id, stripeId, hasActiveSubscription }: UpdateUserProperties): Promise<User | undefined> {
    return User.query().where({ id }).update({ stripeId, hasActiveSubscription }).returning('*').first();
  }
}
