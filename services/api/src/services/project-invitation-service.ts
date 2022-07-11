import { injectable } from 'inversify';
import {
  ProjectInvitationService as ProjectInvitationServiceInterface,
  CreateProjectInvitationInput,
} from '../interfaces';
import { ProjectInvitation } from '../entities';

@injectable()
export class ProjectInvitationService implements ProjectInvitationServiceInterface {
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
