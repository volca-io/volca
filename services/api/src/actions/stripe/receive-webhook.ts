import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';
import { EnvironmentConfig } from '../../utils/environment';
import Stripe from 'stripe';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { stripeService, userService },
    },
  } = ctx;

  const {
    request: { rawBody },
    headers,
  } = ctx;
  const signature = headers['stripe-signature'];

  if (!signature || !rawBody) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Unauthorized',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const event = await stripeService.verifyWebhookSignature({ body: rawBody as string, signature: signature as string });

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeId = subscription.customer as string;
    const user = await userService.findByStripeId(stripeId);

    if (!user) {
      throw new ServiceError({
        name: ErrorNames.USER_DOES_NOT_EXIST,
        message: `The user ${stripeId} does not exist`,
        statusCode: StatusCodes.EXPECTATION_FAILED,
      });
    }

    const priceId = subscription.items.data.pop()?.price.id;

    if (!priceId) {
      throw new ServiceError({
        name: ErrorNames.VALIDATION_ERROR,
        message: `No price ID found for subscription ${subscription.id}`,
        statusCode: StatusCodes.EXPECTATION_FAILED,
      });
    }

    const plan = EnvironmentConfig.plans.find((p) => p.stripePriceId === priceId);

    if (!plan) {
      throw new ServiceError({
        name: ErrorNames.VALIDATION_ERROR,
        message: `No plan found for price ID ${priceId}`,
        statusCode: StatusCodes.EXPECTATION_FAILED,
      });
    }

    await userService.setSubscribed({
      userId: user.id,
      planId: plan.id,
      hasActiveSubscription: event.type === 'customer.subscription.created',
    });
  }

  return {
    body: {
      status: 'success',
    },
  };
});
