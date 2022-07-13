import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { StripeService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.get<StripeService>(DI_TYPES.StripeService);

  if (!ctx.user.stripeId) {
    throw new ServiceError({
      name: ErrorNames.USER_DOES_NOT_EXIST,
      message: 'The user does not exist in Stripe',
      statusCode: StatusCodes.EXPECTATION_FAILED,
    });
  }

  const stripeBillingPortalSession = await stripeService.createBillingPortalSession({
    stripeCustomerId: ctx.user.stripeId,
  });

  return {
    body: {
      stripeBillingPortalSession,
    },
  };
});
