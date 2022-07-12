import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const signOut = useApiAction(async (ctx: CustomContext) => {
  ctx.cookies.set('x-access-token');
});
