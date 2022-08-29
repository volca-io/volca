import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { StripeService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.resolve(StripeService);

  const { user } = ctx;

  const stripeSession = await stripeService.createSession({ user });

  return {
    body: {
      stripeSession,
    },
  };
});
