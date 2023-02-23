import { Model } from 'objection';

export class RefreshToken extends Model {
  id!: string;
  sessionId!: string;
  subject!: string;
  token!: string;
  expiresAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;

  static get tableName() {
    return 'refresh_tokens';
  }
}
