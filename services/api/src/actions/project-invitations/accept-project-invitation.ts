import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectInvitationService } from '../../services';
import { User } from '../../entities';

export const action = useApiAction(async (ctx: CustomContext) => {
  const { id } = ctx.params;

  const user = container.resolve<User>('AuthenticatedUser');
  const projectInvitationService = container.resolve(ProjectInvitationService);

  await projectInvitationService.consume({ id, userId: user.id });

  return {
    body: { accepted: true },
  };
});
