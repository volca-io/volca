import { User } from './user';

export type Project = {
  id: string;
  name: string;
  admin_id: string;
  admin: User;
};
