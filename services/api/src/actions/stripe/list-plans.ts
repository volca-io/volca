import { useApiAction } from '../utils/api-action';
import { CustomContext } from '../../types';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { stripeService },
    },
  } = ctx;

  return {
    body: {
      plans: stripeService.listPlans(),
    },
  };
});
