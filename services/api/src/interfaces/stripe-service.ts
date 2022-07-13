import { User } from '../entities';

export type CreateStripeSessionParams = {
  user: User;
};

export type CreateStripeBillingPortalSessionParams = {
  stripeCustomerId: string;
};

export type StripeSession = {
  id: string;
  url: string;
};

export interface StripeService {
  createSession(input: CreateStripeSessionParams): Promise<StripeSession>;
  createBillingPortalSession(input: CreateStripeBillingPortalSessionParams): Promise<StripeSession>;
}
