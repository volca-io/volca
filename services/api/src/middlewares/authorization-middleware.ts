import Koa from 'koa';
import { container } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../types';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { Role, ProjectService, ProjectUserService } from '../services';
import { User } from '../entities';

export const authorizationMiddleware = (allowedRoles: Role[]) => async (ctx: CustomContext, next: Koa.Next) => {
  const user = container.resolve<User>('AuthenticatedUser');
  const projectService = container.resolve(ProjectService);
  const projectUserService = container.resolve(ProjectUserService);

  // Validate all project IDs in the request body or request parameters
  const projectIds = [
    ctx.request.body.project_id,
    ctx.request.body.projectId,
    ctx.params.projectId,
    ctx.params.project_id,
  ].filter(Boolean);

  for (const projectId of projectIds) {
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
  }

  return next();
};
