import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectService } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const updateProject = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { name, adminId } = ctx.request.body;
  const { id } = ctx.params;

  const project = await projectService.get(id);

  return {
    body: {
      project: await projectService.update({ ...project, id, adminId, name }),
    },
  };
});
