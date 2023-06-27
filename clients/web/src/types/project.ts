import { User } from './user';

export type Project = {
  id: string;
  name: string;
  ownerId: string;
  owner: User;
  users?: User[];
};
