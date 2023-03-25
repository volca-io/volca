import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { StripeService } from '../../services';

export const action = useApiAction(async () => {
  const stripeService = container.resolve(StripeService);
  return {
    body: {
      plans: stripeService.listPlans(),
    },
  };
});
