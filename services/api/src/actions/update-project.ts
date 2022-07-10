import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectService } from '../interfaces';

export const updateProject = async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { name, adminId } = ctx.request.body;
  const { id } = ctx.params;

  const project = await projectService.get(id);

  ctx.body = {
    projects: await projectService.update({ ...project, id, adminId, name }),
  };
};
