import { StatusCodes } from 'http-status-codes';
import { CustomContext } from 'src/types';

interface ApiResult {
  status?: StatusCodes;
  body: Record<string, unknown>;
}

export const useApiAction = (action: (ctx: CustomContext) => Promise<ApiResult | void>) => {
  return async (ctx: CustomContext) => {
    const response = await action(ctx);

    if (response) {
      ctx.set('Content-Type', 'application/json');
      ctx.status = response.status || StatusCodes.OK;
      ctx.body = response.body;
    }
  };
};
