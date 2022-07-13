import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { ProjectService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const projects = await projectService.list(ctx.user.id);

  return {
    body: { projects },
  };
});
