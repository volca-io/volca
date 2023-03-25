import { Model, Pojo } from 'objection';
import _ from 'lodash';

export class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  stripeId?: string;
  email!: string;
  password?: string;
  hasActiveSubscription!: boolean;
  freeTrialActivated!: boolean;
  planId?: string;
  verifiedAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  private static hiddenFields = ['password', 'stripeId'];

  static get tableName() {
    return 'users';
  }

  $formatJson(input: Pojo): Pojo {
    const json = super.$formatJson(input);
    const retval = _.omit(json, User.hiddenFields);
    return retval;
  }
}
