import { Model, QueryBuilder} from 'objection';

import { User } from './user';

export class Project extends Model {
  id!: string;
  name!: string;
  adminId!: string;
  admin!: User;
  createdAt!: Date;
  updatedAt!: Date;

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
    users: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      join: {
        from: 'users.id',
        through: {
          from: 'project_users.projectId',
          to: 'project_users.userId',
        },
        to: 'projects.id',
      },
    },
  };
}
