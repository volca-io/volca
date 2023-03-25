import { useCallback } from 'react';
import { ApiClient } from '../lib/clients/api-client';
import { Plan, StripeSession } from '../types';
import { useApiActions } from './api-actions';

export const useSubscriptionActions = () => {
  const { executeApiAction } = useApiActions();

  const manageSubscriptions = async () =>
    await executeApiAction<StripeSession>({
      action: () => ApiClient.createStripeBillingPortalSession(),
      onSuccess: (session: StripeSession) => window.location.replace(session.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const activateSubscription = async (planId: string) =>
    await executeApiAction<StripeSession>({
      action: () => ApiClient.createStripeSession({ planId }),
      onSuccess: (session: StripeSession) => window.location.replace(session.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  const listPlans = async () =>
    executeApiAction<Plan[]>({
      action: () => ApiClient.listStripePlans(),
      errorMessage: 'Failed to fetch products.',
    });

  return {
    manageSubscriptions: useCallback(manageSubscriptions, [executeApiAction]),
    activateSubscription: useCallback(activateSubscription, [executeApiAction]),
    listPlans: useCallback(listPlans, [executeApiAction]),
  };
};
