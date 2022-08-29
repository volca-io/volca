import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';
import { ProjectService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

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
