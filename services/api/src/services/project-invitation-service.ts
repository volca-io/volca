import { injectable } from 'tsyringe';
import { ProjectInvitation } from '../entities';

type CreateProjectInvitationInput = {
  projectId: string;
  toUserId: string;
  fromUserId: string;
};

@injectable()
export class ProjectInvitationService {
  public async get(id: string): Promise<ProjectInvitation | undefined> {
    return ProjectInvitation.query().findById(id).returning('*');
  }

  public async findByKey(key: string): Promise<ProjectInvitation | undefined> {
    return ProjectInvitation.query().findOne({ key });
  }

  public async create({ fromUserId, toUserId, projectId }: CreateProjectInvitationInput): Promise<ProjectInvitation> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + 1 * 60 * 60 * 1000);
    return ProjectInvitation.query().insert({ fromUserId, toUserId, projectId, expiresAt }).returning('*');
  }
}
