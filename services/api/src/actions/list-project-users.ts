import { CustomContext, DI_TYPES } from '../types';
import { container } from '../inversify.config';
import { ProjectUserService } from '../interfaces';
import { useApiAction } from './utils/api-action';

export const listProjectUsers = useApiAction(async (ctx: CustomContext) => {
  const projectUserService = container.get<ProjectUserService>(DI_TYPES.ProjectUserService);

  const { projectId } = ctx.params;

  const users = await projectUserService.list(projectId);

  return {
    body: { users },
  };
});
