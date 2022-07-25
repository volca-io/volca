import { Model, QueryBuilder } from 'objection';

import { User } from './user';

export class Project extends Model {
  id!: string;
  name!: string;
  adminId!: string;
  admin!: User;

  static get tableName() {
    return 'projects';
  }

  static relationMappings = {
    admin: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      modify: (query: QueryBuilder<User>) =>
        query.select('id', 'hasActiveSubscription', 'firstName', 'lastName', 'email'),
      join: {
        from: 'projects.adminId',
        to: 'users.id',
      },
    },
  };
}
