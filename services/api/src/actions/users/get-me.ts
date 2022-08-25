import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  return {
    body: {
      me: ctx.user.toDTO(),
    },
  };
});