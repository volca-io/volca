import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { StripeService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.get<StripeService>(DI_TYPES.StripeService);

  const stripeSession = await stripeService.createSession({ userId: ctx.user.id, email: ctx.user.email });

  return {
    body: {
      stripeSession,
    },
  };
});
