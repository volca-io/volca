import { Stripe } from 'stripe';

import { User } from '../entities';

export type CreateStripeSessionParams = {
  user: User;
};

export type CreateStripeBillingPortalSessionParams = {
  stripeCustomerId: string;
};

export type VerifyStripeWebhookSignatureParams = {
  body: string;
  signature: string;
};

export type StripeSession = {
  id: string;
  url: string;
};

export interface StripeService {
  createSession(input: CreateStripeSessionParams): Promise<StripeSession>;
  createBillingPortalSession(input: CreateStripeBillingPortalSessionParams): Promise<StripeSession>;
  verifyWebhookSignature({ body, signature }: VerifyStripeWebhookSignatureParams): Promise<Stripe.Event>;
}
