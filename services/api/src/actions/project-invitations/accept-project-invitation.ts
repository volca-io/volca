import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { ProjectInvitationService, ProjectRoleId, ProjectUserService } from '../../services';
import { User } from '../../entities';

export const action = useApiAction(async (ctx: CustomContext) => {
  const user = container.resolve<User>('AuthenticatedUser');

  const projectInvitationService = container.resolve(ProjectInvitationService);
  const projectUserService = container.resolve(ProjectUserService);

  const { key } = ctx.params;

  const projectInvitation = await projectInvitationService.findByKey(key);

  if (!projectInvitation) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_INVITATION_INVALID,
      message: 'The project invitation is invalid',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (Date.now() > projectInvitation.expiresAt.getTime()) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_INVITATION_EXPIRED,
      message: 'The project invitation is expired',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (projectInvitation.toUserId !== user.id) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Unauthorized',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const projectUser = await projectUserService.get(user.id, projectInvitation.projectId);

  if (!projectUser) {
    await projectUserService.create({
      userId: user.id,
      projectId: projectInvitation.projectId,
      role: ProjectRoleId.MEMBER,
    });
  }

  return {
    body: {
      accepted: true,
    },
  };
});
