import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { StripeService } from '../../services';
import { User } from '../../entities';
import { CustomContext } from '../../types';
import joi, { Schema } from 'joi';

export const schema: Schema = joi.object({
  plan_id: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.resolve(StripeService);
  const user = container.resolve<User>('AuthenticatedUser');

  const { planId } = ctx.request.body;

  const stripeSession = await stripeService.createSession({ user, planId });

  return {
    body: {
      stripeSession,
    },
  };
});
