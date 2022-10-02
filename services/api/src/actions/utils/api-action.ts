import { StatusCodes } from 'http-status-codes';
import snakecase from 'snakecase-keys';
import camelcase from 'camelcase-keys';
import { CustomContext } from '../../types';

interface ApiResult {
  status?: StatusCodes;
  body: Record<string, unknown>;
}

export const useApiAction = (action: (ctx: CustomContext) => Promise<ApiResult | void>) => {
  return async (ctx: CustomContext) => {
    if (ctx.request.body && ctx.request.body instanceof Object) {
      ctx.request.body = camelcase(ctx.request.body, { deep: true });
    }

    const response = await action(ctx);

    if (response) {
      ctx.status = response.status || StatusCodes.OK;
      ctx.set('Content-Type', 'application/json');
      ctx.body = snakecase(response.body, { deep: true });
    } else {
      ctx.status = StatusCodes.OK;
    }
  };
};
