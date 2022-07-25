import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { StripeService, UserService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.get<StripeService>(DI_TYPES.StripeService);
  const userService = container.get<UserService>(DI_TYPES.UserService);

  const { body, headers } = ctx;
  const signature = headers['stripe-signature'];

  if (!signature || body) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'Unauthorized',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const event = await stripeService.verifyWebhookSignature({ body: body as string, signature: signature as string });

  if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.deleted') {
    const obj = event.data.object as { customer: string };
    const stripeId = obj.customer;
    const user = await userService.findByStripeId(stripeId);

    if (!user) {
      throw new ServiceError({
        name: ErrorNames.USER_DOES_NOT_EXIST,
        message: 'The user does not exist',
        statusCode: StatusCodes.EXPECTATION_FAILED,
      });
    }

    await userService.update({
      id: user.id,
      hasActiveSubscription: event.type === 'customer.subscription.created',
      ...(event.type === 'customer.subscription.created' ? { freeTrialActivated: true } : {}),
    });
  }

  return {
    body: {
      status: 'success',
    },
  };
});
