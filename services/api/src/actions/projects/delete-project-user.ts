import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectUserService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectUserService = container.resolve(ProjectUserService);

  const { projectId, userId } = ctx.params;

  await projectUserService.delete(projectId, userId);
});
