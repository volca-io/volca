import { useApiAction } from '../utils/api-action';
import { CustomContext } from '../../types';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    dependencies: {
      services: { projectService },
    },
  } = ctx;

  const projects = await projectService.list(user.id);

  return {
    body: { projects: projects.map((project) => project.toJSON()) },
  };
});
