import { injectable } from 'tsyringe';
import { Project, ProjectUser, User } from '../entities';
import { Role } from './project-service';

type UpdateProjectUserInput = {
  id: string;
  role: Role;
};

@injectable()
export class ProjectUserService {
  public async get(userId: string, projectId: string): Promise<ProjectUser | undefined> {
    return ProjectUser.query().where({ userId }).andWhere({ projectId }).first();
  }

  public async list(projectId: string): Promise<User[]> {
    const project = await Project.query().where({ id: projectId }).withGraphFetched('users').first();
    if (!project) return [];
    return project.users;
  }

  public async delete(projectId: string, userId: string) {
    return ProjectUser.query().where({ userId, projectId }).del();
  }

  public async create({
    userId,
    projectId,
    role,
  }: {
    userId: string;
    projectId: string;
    role: Role;
  }): Promise<ProjectUser> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + 1 * 60 * 60 * 1000);
    return ProjectUser.query().insert({ userId, projectId, role }).returning('*');
  }

  public async update({ id, role }: UpdateProjectUserInput): Promise<void> {
    await ProjectUser.query().where({ id }).update({ role });
  }
}
