import { injectable } from 'inversify';
import { ProjectUserService as ProjectUserServiceInterface } from '../interfaces';
import { ProjectUser } from '../entities';

@injectable()
export class ProjectUserService implements ProjectUserServiceInterface {
  public async get(userId: string, projectId: string): Promise<ProjectUser | undefined> {
    return ProjectUser.query().where({ userId }).andWhere({ projectId }).first();
  }

  public async create({ userId, projectId }: { userId: string; projectId: string }): Promise<ProjectUser> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + 1 * 60 * 60 * 1000);
    return ProjectUser.query().insert({ userId, projectId }).returning('*');
  }
}
