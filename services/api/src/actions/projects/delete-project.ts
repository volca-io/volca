import { container } from 'tsyringe';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  const { projectId: id } = ctx.params;

  await projectService.delete(id);

  return {
    body: {},
  };
});
