import { container } from 'tsyringe';
import { AuthenticationService } from '../../services';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const authnService = container.resolve(AuthenticationService);
  const refreshToken = ctx.cookies.get('x-refresh-token');

  if (refreshToken) {
    await authnService.expireToken(refreshToken);
  }

  ctx.cookies.set('x-refresh-token');
});
