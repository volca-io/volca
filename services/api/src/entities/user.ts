import { Model } from 'objection';

export class User extends Model {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  password?: string;

  static get tableName() {
    return 'users';
  }

  toDTO() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
    };
  }
}
