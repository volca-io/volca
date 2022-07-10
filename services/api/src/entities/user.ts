import { Model } from 'objection';

export class User extends Model {
  id: string;

  constructor() {
    super();
    this.id = '2c68a088-578e-4263-8639-31083f184085'; // placeholder
  }

  static get tableName() {
    return 'users';
  }
}
