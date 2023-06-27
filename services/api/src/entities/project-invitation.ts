import { Model } from 'objection';

export class ProjectInvitation extends Model {
  id!: string;
  fromUserId!: string;
  projectId!: string;
  expiresAt!: Date;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'projectInvitations';
  }
}
