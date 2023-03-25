import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { User } from '../entities';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Security } from '../lib/security/security';
import { CommunicationsService } from './communications-service';

type RegisterUserProperties = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

@injectable()
export class UserService {
  public constructor(private security: Security, private comsService: CommunicationsService) {}

  public async findById(id: string): Promise<User | undefined> {
    return User.query().findById(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return User.query().where({ email: email.toLowerCase() }).first();
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

    const hashedPassword = this.security.hashPassword(password);

    const user = await User.query().insert({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = this.security.createToken({ payload: { sub: email }, expiresIn: 60 * 60 * 24 });
    await this.comsService.sendVerificationEmail({ email, firstName, token });

    return user;
  }

  public async update(id: string, properties: Omit<Partial<User>, 'id'>): Promise<User | undefined> {
    return User.query().findOne({ id }).update(properties).returning('*').first();
  }

  public async setSubscribed({
    userId,
    hasActiveSubscription,
    planId,
  }: {
    userId: string;
    hasActiveSubscription: boolean;
    planId: string;
  }) {
    const user = await this.findById(userId);

    if (!user) {
      throw new ServiceError({
        name: ErrorNames.USER_DOES_NOT_EXIST,
        message: 'The user does not exist',
        statusCode: StatusCodes.EXPECTATION_FAILED,
      });
    }

    return this.update(user.id, {
      hasActiveSubscription,
      planId,
      ...(hasActiveSubscription ? { freeTrialActivated: true } : {}),
    });
  }
}
