import { Model } from 'objection';

import { User } from './user';

export class Project extends Model {
  id!: string;
  name!: string;
  ownerId!: string;
  owner!: User;
  createdAt!: Date;
  updatedAt!: Date;
  users!: User[];

  static get tableName() {
    return 'projects';
  }

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'projects.ownerId',
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
          extra: {
            role: 'role',
          },
        },
        to: 'projects.id',
      },
    },
  };
}
