import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { StripeService } from '../../services';
import { User } from '../../entities';

export const action = useApiAction(async () => {
  const stripeService = container.resolve(StripeService);
  const user = container.resolve<User>('AuthenticatedUser');

  const stripeSession = await stripeService.createSession({ user });

  return {
    body: {
      stripeSession,
    },
  };
});
