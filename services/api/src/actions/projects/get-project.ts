import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { ProjectService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const project = await projectService.get(ctx.params.id);

  if (!project?.admin.hasActiveSubscription) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'The project does not exist',
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  return {
    body: {
      project,
    },
  };
});
