import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';
import { StatusCodes } from 'http-status-codes';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  const project = await projectService.get(ctx.params.projectId);

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
