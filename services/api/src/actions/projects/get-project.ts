import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { StatusCodes } from 'http-status-codes';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { projectService },
    },
    params: { projectId },
  } = ctx;

  const project = await projectService.get(projectId);

  if (!project) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'Could not find the specified project',
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return {
    body: {
      project: project.toJSON(),
    },
  };
});
