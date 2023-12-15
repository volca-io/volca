import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    params: { projectId },
    dependencies: {
      services: { projectUserService },
    },
  } = ctx;

  const users = await projectUserService.list(projectId);

  return {
    body: { users: users.map((user) => user.toJSON()) },
  };
});
