import { Model } from 'objection';

export class ProjectInvitation extends Model {
  id!: string;
  fromUserId!: string;
  toUserId!: string;
  projectId!: string;
  expiresAt!: Date;
  key!: string;
  role!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'project_invitations';
  }
}
