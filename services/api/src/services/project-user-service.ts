import { injectable } from 'tsyringe';
import { ProjectUser, User, UserDTO } from '../entities';

@injectable()
export class ProjectUserService {
  public async get(userId: string, projectId: string): Promise<ProjectUser | undefined> {
    return ProjectUser.query().where({ userId }).andWhere({ projectId }).first();
  }

  public async list(projectId: string): Promise<UserDTO[]> {
    const projectUsers = await ProjectUser.query().where({ projectId });
    const users = await User.query().whereIn(
      'id',
      projectUsers.map((pu) => pu.userId)
    );
    return users.map((user) => user.toDTO());
  }

  public async delete(projectId: string, userId: string) {
    return ProjectUser.query().where({ userId, projectId }).del();
  }

  public async create({ userId, projectId }: { userId: string; projectId: string }): Promise<ProjectUser> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + 1 * 60 * 60 * 1000);
    return ProjectUser.query().insert({ userId, projectId }).returning('*');
  }
}
