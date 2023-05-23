import { Model } from 'objection';
import { Role } from '../services';

export class ProjectUser extends Model {
  id!: string;
  userId!: string;
  projectId!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'project_users';
  }
}
