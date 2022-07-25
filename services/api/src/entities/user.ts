import { Model } from 'objection';

export class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  stripeId?: string;
  email!: string;
  password?: string;
  hasActiveSubscription!: boolean;
  freeTrialActivated!: boolean;

  static get tableName() {
    return 'users';
  }

  toDTO() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      hasActiveSubscription: this.hasActiveSubscription,
      freeTrialActivated: this.freeTrialActivated,
    };
  }
}
