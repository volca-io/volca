import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectService } from '../interfaces';

export const createProject = async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { name } = ctx.request.body;

  ctx.body = {
    projects: await projectService.create({ adminId: ctx.user.id, name }),
  };
};
