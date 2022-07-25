import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  ctx.cookies.set('x-refresh-token');
});
