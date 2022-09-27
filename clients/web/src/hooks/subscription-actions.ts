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
      errorMessage: 'Failed to create Stripe session.',
    });

  const activateSubscription = async () =>
    await executeApiAction<StripeSession>({
      action: () => ApiClient.createStripeSession(),
      onSuccess: (session: StripeSession) => window.location.replace(session.url),
      errorMessage: 'Failed to create Stripe session.',
    });

  return {
    manageSubscriptions: useCallback(manageSubscriptions, [executeApiAction]),
    activateSubscription: useCallback(activateSubscription, [executeApiAction]),
  };
};
