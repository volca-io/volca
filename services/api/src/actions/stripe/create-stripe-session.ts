import joi, { Schema } from 'joi';
import { useApiAction } from '../utils/api-action';
import { CustomContext } from '../../types';
import { PlanId } from '../../../../../types/types';

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
  const {
    user,
    dependencies: {
      services: { stripeService },
    },
  } = ctx;

  const { planId } = <CreateStripeSessionBody>ctx.request.body;
  const stripeSession = await stripeService.createSession({ user, planId });

  return {
    body: {
      stripeSession,
    },
  };
});
