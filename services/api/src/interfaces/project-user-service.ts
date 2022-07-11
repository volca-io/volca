import { ProjectUser } from '../entities';

export interface ProjectUserService {
  get(userId: string, projectId: string): Promise<ProjectUser | undefined>;
  create(input: { userId: string; projectId: string }): Promise<ProjectUser>;
}
