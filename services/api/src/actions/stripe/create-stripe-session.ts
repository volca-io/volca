import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { StripeService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.get<StripeService>(DI_TYPES.StripeService);

  const { user } = ctx;

  const stripeSession = await stripeService.createSession({ user });

  return {
    body: {
      stripeSession,
    },
  };
});
