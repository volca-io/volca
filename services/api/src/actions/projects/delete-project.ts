import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  await projectService.delete(ctx.params.id);

  return {
    body: {},
  };
});
