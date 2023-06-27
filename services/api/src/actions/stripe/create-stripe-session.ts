import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { StripeService } from '../../services';
import { User } from '../../entities';
import { CustomContext } from '../../types';
import joi, { Schema } from 'joi';
import { PlanId } from '../../../../../config/types';

type CreateStripeSessionBody = {
  planId: PlanId;
};

export const schema: Schema = joi.object({
  planId: joi
    .string()
    .valid(...Object.keys(PlanId))
    .required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const stripeService = container.resolve(StripeService);
  const user = container.resolve<User>('AuthenticatedUser');

  const { planId } = <CreateStripeSessionBody>ctx.request.body;

  const stripeSession = await stripeService.createSession({ user, planId });

  return {
    body: {
      stripeSession,
    },
  };
});
