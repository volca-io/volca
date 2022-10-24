import { Model } from 'objection';

export type UserDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hasActiveSubscription: boolean;
  freeTrialActivated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  stripeId?: string;
  email!: string;
  password?: string;
  hasActiveSubscription!: boolean;
  freeTrialActivated!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'users';
  }

  toDTO(): UserDTO {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      hasActiveSubscription: this.hasActiveSubscription,
      freeTrialActivated: this.freeTrialActivated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
