import { Model } from 'objection';

export class ProjectUser extends Model {
  id!: string;
  userId!: string;
  projectId!: string;

  static get tableName() {
    return 'project_users';
  }
}
