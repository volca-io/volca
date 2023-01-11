import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';
import { User } from '../../entities';

export const action = useApiAction(async () => {
  const projectService = container.resolve(ProjectService);
  const user = container.resolve<User>('AuthenticatedUser');

  const projects = await projectService.list(user.id);

  return {
    body: { projects: projects.map(project => project.toJSON()) },
  };
});
