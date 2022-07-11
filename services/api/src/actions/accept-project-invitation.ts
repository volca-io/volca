import { StatusCodes } from 'http-status-codes';

import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectInvitationService, ProjectUserService } from '../interfaces';
import { useApiAction } from './utils/api-action';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

export const acceptProjectInvitation = useApiAction(async (ctx: CustomContext) => {
  const projectInvitationService = container.get<ProjectInvitationService>(DI_TYPES.ProjectInvitationService);
  const projectUserService = container.get<ProjectUserService>(DI_TYPES.ProjectUserService);

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

  if (projectInvitation.toUserId !== ctx.user.id) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Unauthorized',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const projectUser = await projectUserService.get(ctx.user.id, projectInvitation.projectId);

  if (!projectUser) {
    await projectUserService.create({ userId: ctx.user.id, projectId: projectInvitation.projectId });
  }

  return {
    body: {
      accepted: true,
    },
  };
});
