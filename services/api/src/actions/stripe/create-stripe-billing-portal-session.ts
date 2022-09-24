import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';
import { StripeService } from '../../services';
import { User } from '../../entities';

export const action = useApiAction(async () => {
  const stripeService = container.resolve(StripeService);
  const user = container.resolve<User>('AuthenticatedUser');

  if (!user.stripeId) {
    throw new ServiceError({
      name: ErrorNames.USER_DOES_NOT_EXIST,
      message: 'The user does not exist in Stripe',
      statusCode: StatusCodes.EXPECTATION_FAILED,
    });
  }

  const stripeBillingPortalSession = await stripeService.createBillingPortalSession({
    stripeCustomerId: user.stripeId,
  });

  return {
    body: {
      stripeBillingPortalSession,
    },
  };
});
