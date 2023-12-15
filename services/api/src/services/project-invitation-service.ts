import { StatusCodes } from 'http-status-codes';
import { ErrorNames } from '../constants';
import { ProjectInvitation } from '../entities';
import { ServiceError } from '../errors/service-error';
import { Role } from './project-service';
import { ProjectUserService } from './project-user-service';

type CreateProjectInvitationInput = {
  projectId: string;
  fromUserId: string;
};

type ConsumeProjectInvitationInput = {
  id: string;
  userId: string;
};

export class ProjectInvitationService {
  constructor(private projectUserService: ProjectUserService) {}

  private async get(id: string): Promise<ProjectInvitation | undefined> {
    return ProjectInvitation.query().findOne({ id });
  }

  private async delete(id: string): Promise<void> {
    await ProjectInvitation.query().where({ id }).del();
  }

  public async create({ fromUserId, projectId }: CreateProjectInvitationInput): Promise<ProjectInvitation> {
    const expiresAt = new Date();
    expiresAt.setTime(expiresAt.getTime() + 1 * 60 * 60 * 1000);
    return ProjectInvitation.query().insert({ fromUserId, projectId, expiresAt }).returning('*');
  }

  public async consume({ id, userId }: ConsumeProjectInvitationInput) {
    const projectInvitation = await this.get(id);

    if (!projectInvitation) {
      throw new ServiceError({
        name: ErrorNames.PROJECT_INVITATION_INVALID,
        message: 'The project invitation is invalid',
        debug: 'Could not find a invitation with the specified key',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    if (Date.now() > projectInvitation.expiresAt.getTime()) {
      throw new ServiceError({
        name: ErrorNames.PROJECT_INVITATION_EXPIRED,
        message: 'The project invitation is expired',
        debug: 'The project invitation is expired',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }
    const projectUser = await this.projectUserService.get(userId, projectInvitation.projectId);

    if (!projectUser) {
      await this.projectUserService.create({
        userId,
        projectId: projectInvitation.projectId,
        role: Role.MEMBER,
      });
    }

    await this.delete(projectInvitation.id);
  }
}
