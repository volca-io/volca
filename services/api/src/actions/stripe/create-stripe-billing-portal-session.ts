import { StatusCodes } from 'http-status-codes';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { CustomContext } from '../../types';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    dependencies: {
      services: { stripeService },
    },
  } = ctx;

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
