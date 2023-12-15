import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    dependencies: {
      services: { projectInvitationService },
    },
    params: { invitationId },
  } = ctx;

  await projectInvitationService.consume({ id: invitationId, userId: user.id });

  return {
    body: { accepted: true },
  };
});
