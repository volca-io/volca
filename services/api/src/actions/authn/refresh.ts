import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { AuthenticationService } from '../../services';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';

export const action = useApiAction(async (ctx: CustomContext) => {
  const authnService = container.resolve(AuthenticationService);
  const refreshToken = ctx.cookies.get('x-refresh-token');

  if (!refreshToken) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'No refresh token was attached to the request',
      statusCode: StatusCodes.UNAUTHORIZED,
      debug: 'No refresh token cookie was present in the request',
    });
  }

  const { accessToken, expiresIn } = await authnService.refreshToken(refreshToken);

  return {
    body: {
      accessToken,
      expiresIn,
    },
  };
});
