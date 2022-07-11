import { CustomContext } from '../types';
import { useApiAction } from './utils/api-action';

export const helloWorldAction = useApiAction(async (ctx: CustomContext) => {
  return {
    body: {
      message: `Hello, ${ctx.user.firstName}!`,
    },
  };
});
