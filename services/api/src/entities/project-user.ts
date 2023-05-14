import { Model } from 'objection';

export class ProjectUser extends Model {
  id!: string;
  userId!: string;
  projectId!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'project_users';
  }
}
