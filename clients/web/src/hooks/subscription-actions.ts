import { useCallback } from 'react';
import { ApiClient } from '../lib/clients/api-client';
import { StripeSession } from '../types';
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

  const activateSubscription = async () =>
    await executeApiAction<StripeSession>({
      action: () => ApiClient.createStripeSession(),
      onSuccess: (session: StripeSession) => window.location.replace(session.url),
      errorMessage:
        'Failed to create Stripe session. Make sure you have configured your Stripe API keys for this environment.',
    });

  return {
    manageSubscriptions: useCallback(manageSubscriptions, [executeApiAction]),
    activateSubscription: useCallback(activateSubscription, [executeApiAction]),
  };
};
