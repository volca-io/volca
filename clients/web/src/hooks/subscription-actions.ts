import { useCallback } from 'react';
import { getClient } from '../lib/api-client';
import { Plan, StripeSession } from '../types';
import { useApiActions } from './api-actions';

type CreateStripeBillingPortalSessionResponse = {
  stripe_billing_portal_session: StripeSession;
};

type CreateStripeSessionResponse = {
  stripe_session: StripeSession;
};

type StripePlansReponse = {
  plans: Plan[];
};

export const useSubscriptionActions = () => {
  const { executeApiAction } = useApiActions();

  const manageSubscriptions = async () =>
    await executeApiAction<StripeSession>({
      action: () => getClient().post('stripe/billing-portal-sessions').json<CreateStripeBillingPortalSessionResponse>(),
      onSuccess: (response: CreateStripeBillingPortalSessionResponse) =>
        window.location.replace(response.stripe_billing_portal_session.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const activateSubscription = async (planId: string) =>
    await executeApiAction<StripeSession>({
      action: () =>
        getClient()
          .post('stripe/sessions', { json: { plan_id: planId } })
          .json<CreateStripeSessionResponse>(),
      onSuccess: (response: CreateStripeSessionResponse) => window.location.replace(response.stripe_session.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const listPlans = async () =>
    executeApiAction<Plan[]>({
      action: async () => (await getClient().get('stripe/plans').json<StripePlansReponse>()).plans,
      errorMessage: 'Failed to fetch products.',
    });

  return {
    manageSubscriptions: useCallback(manageSubscriptions, [executeApiAction]),
    activateSubscription: useCallback(activateSubscription, [executeApiAction]),
    listPlans: useCallback(listPlans, [executeApiAction]),
  };
};
