import { Model } from 'objection';

export class Project extends Model {
  id!: string;
  name!: string;
  adminId!: string;

  static get tableName() {
    return 'projects';
  }
}
