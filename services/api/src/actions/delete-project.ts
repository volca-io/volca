import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectService } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const deleteProject = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  await projectService.delete(ctx.params.id);

  return {
    body: {},
  };
});
