import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { projectService, projectUserService },
    },
    params: { projectId },
  } = ctx;

  const projectUsers = await projectUserService.list(projectId);

  if (projectUsers.length > 1) {
    throw new ServiceError({
      name: ErrorNames.VALIDATION_ERROR,
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'The project still has users attached. Remove the users and try again.',
    });
  }

  await projectService.delete(projectId);
});
