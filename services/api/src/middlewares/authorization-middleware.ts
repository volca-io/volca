import Koa from 'koa';
import { StatusCodes } from 'http-status-codes';
import { CustomContext } from '../types';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Role } from '../services';

export const authorizationMiddleware = (allowedRoles: Role[]) => async (ctx: CustomContext, next: Koa.Next) => {
  const {
    user,
    dependencies: {
      services: { projectService, projectUserService },
    },
    params: { projectId },
  } = ctx;

  if (projectId) {
    const project = await projectService.get(projectId);
    const projectUser = await projectUserService.get(user.id, projectId);

    if (!project || !projectUser || !project?.owner.hasActiveSubscription) {
      throw new ServiceError({
        name: ErrorNames.PROJECT_DOES_NOT_EXIST,
        message: 'The project does not exist',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (!allowedRoles.includes(projectUser.role)) {
      throw new ServiceError({
        name: ErrorNames.AUTHORIZATION_FAILED,
        message: 'The user does not have the required privileges for this action',
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    ctx.project = project;
  }

  return next();
};
