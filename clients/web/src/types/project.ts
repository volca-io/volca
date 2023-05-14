import { User } from './user';

export type Project = {
  id: string;
  name: string;
  owner_id: string;
  owner: User;
  users?: User[];
};
