import { StatusCodes } from 'http-status-codes';

import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectInvitationService, ProjectService, UserService } from '../interfaces';
import { useApiAction } from './utils/api-action';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

export const createProjectInvitation = useApiAction(async (ctx: CustomContext) => {
  const projectInvitationService = container.get<ProjectInvitationService>(DI_TYPES.ProjectInvitationService);
  const userService = container.get<UserService>(DI_TYPES.UserService);
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { toUserEmail, projectId } = ctx.request.body;

  const project = await projectService.get(projectId);

  if (!project) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'The project does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (project.adminId !== ctx.user.id) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'The user is not authorized for this project',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const toUser = await userService.findByEmail(toUserEmail);

  if (!toUser) {
    throw new ServiceError({
      name: ErrorNames.USER_DOES_NOT_EXIST,
      message: 'The user does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const projectInvitation = await projectInvitationService.create({
    fromUserId: ctx.user.id,
    toUserId: toUser.id,
    projectId: project.id,
  });

  return {
    body: {
      projectInvitation,
    },
  };
});
