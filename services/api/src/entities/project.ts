import { Model } from 'objection';

export class Project extends Model {
  static get tableName() {
    return 'projects';
  }
}
