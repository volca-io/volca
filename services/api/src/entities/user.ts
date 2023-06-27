import { Model, Pojo } from 'objection';
import _ from 'lodash';
import { Role } from '../services';

export class User extends Model {
  id!: string;
  cognitoSubject!: string;
  firstName!: string;
  lastName!: string;
  stripeId?: string;
  email!: string;
  picture?: string;
  hasActiveSubscription!: boolean;
  freeTrialActivated!: boolean;
  planId?: string;
  createdAt!: Date;
  updatedAt!: Date;
  role?: Role;

  private static hiddenFields = ['stripeId', 'cognitoSubject'];

  static get tableName() {
    return 'users';
  }

  $formatJson(input: Pojo): Pojo {
    const json = super.$formatJson(input);
    const retval = _.omit(json, User.hiddenFields);
    return retval;
  }
}
