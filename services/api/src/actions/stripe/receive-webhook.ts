import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';
import { StripeService, UserService } from '../../services';

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.resolve(StripeService);
  const userService = container.resolve(UserService);

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

    await userService.setSubscribed({
      userId: user.id,
      hasActiveSubscription: event.type === 'customer.subscription.created',
    });
  }

  return {
    body: {
      status: 'success',
    },
  };
});
