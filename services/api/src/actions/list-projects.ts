import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectService } from '../interfaces';

// TODO: Can we group actions by entity perhaps? Will be a lot of these if we have one file per action
export const listProjects = async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const result = await projectService.list();

  // TODO: Can we do this with a middleware for every response to avoid duplication?
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    result,
  });
};
