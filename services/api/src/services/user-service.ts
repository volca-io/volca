import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { User } from '../entities';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

type ProvisionUserProperties = {
  sub: string;
  identityId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  picture?: string;
};

@injectable()
export class UserService {
  public async findById(id: string): Promise<User | undefined> {
    return User.query().findById(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return User.query().where({ email: email.toLowerCase() }).first();
  }

  public async findByCognitoSubject(cognitoSubject: string): Promise<User | undefined> {
    return User.query().where({ cognitoSubject }).first();
  }

  public async findByStripeId(stripeId: string): Promise<User | undefined> {
    return User.query().where({ stripeId }).first();
  }

  public async provision({
    sub,
    identityId,
    firstName,
    lastName,
    email,
    picture,
  }: ProvisionUserProperties): Promise<User> {
    const existingUser = await this.findByCognitoSubject(sub);

    if (existingUser) return existingUser;

    const user = await User.query()
      .insert({
        cognitoSubject: sub,
        cognitoIdentityId: identityId,
        firstName,
        lastName,
        email: email.toLowerCase(),
        picture,
      })
      .returning('*');

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
