import { useCallback } from 'react';
import { Plan, StripeSession } from '../types';
import { useApiActions } from './api-actions';

type CreateStripeBillingPortalSessionResponse = {
  stripeBillingPortalSession: StripeSession;
};

type CreateStripeSessionResponse = {
  stripeSession: StripeSession;
};

type StripePlansReponse = {
  plans: Plan[];
};

export const useSubscriptionActions = () => {
  const { executeApiAction } = useApiActions();

  const manageSubscriptions = async () =>
    await executeApiAction<CreateStripeBillingPortalSessionResponse>({
      action: ({ client }) =>
        client.post('stripe/billing-portal-sessions').json<CreateStripeBillingPortalSessionResponse>(),
      onSuccess: (response: CreateStripeBillingPortalSessionResponse) =>
        window.location.replace(response.stripeBillingPortalSession.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const activateSubscription = async (planId: string) =>
    await executeApiAction<CreateStripeSessionResponse>({
      action: ({ client }) =>
        client.post('stripe/sessions', { json: { planId: planId } }).json<CreateStripeSessionResponse>(),
      onSuccess: (response: CreateStripeSessionResponse) => window.location.replace(response.stripeSession.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const listPlans = async () =>
    executeApiAction<Plan[]>({
      action: async ({ client }) => (await client.get('stripe/plans').json<StripePlansReponse>()).plans,
      errorMessage: 'Failed to fetch products.',
    });

  return {
    manageSubscriptions: useCallback(manageSubscriptions, [executeApiAction]),
    activateSubscription: useCallback(activateSubscription, [executeApiAction]),
    listPlans: useCallback(listPlans, [executeApiAction]),
  };
};
