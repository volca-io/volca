import { ProjectUser, User } from '../entities';

export interface ProjectUserService {
  get(userId: string, projectId: string): Promise<ProjectUser | undefined>;
  list(projectId: string): Promise<User[]>;
  create(input: { userId: string; projectId: string }): Promise<ProjectUser>;
}
