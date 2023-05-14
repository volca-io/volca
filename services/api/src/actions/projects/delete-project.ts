import { container } from 'tsyringe';
import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ProjectService, ProjectUserService } from '../../services';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);
  const projectUserService = container.resolve(ProjectUserService);

  const { projectId: id } = ctx.params;

  const projectUsers = await projectUserService.list(id);

  if (projectUsers.length > 1) {
    throw new ServiceError({
      name: ErrorNames.VALIDATION_ERROR,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'The project still has users attached. Remove the users and try again.',
    });
  }

  await projectService.delete(id);
});
