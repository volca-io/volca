import { injectable } from 'inversify';

import {
  StripeSession,
  CreateStripeSessionParams,
  CreateStripeBillingPortalSessionParams,
} from 'src/interfaces/stripe-service';
import { StripeService as StripeServiceInterface } from '../interfaces';
import { User } from '../entities';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY as string, { apiVersion: '2020-08-27' });

@injectable()
export class StripeService implements StripeServiceInterface {
  public async createSession({ user }: CreateStripeSessionParams): Promise<StripeSession> {
    const getStripeCustomerId = async () => {
      if (!user.stripeId) {
        const { id: stripeId } = await stripe.customers.create({ email: user.email });
        await User.query().where({ id: user.id }).update({ stripeId });
        return stripeId;
      }
      return user?.stripeId;
    };

    const customer = await getStripeCustomerId();

    const session = await stripe.checkout.sessions.create({
      success_url: 'http://127.0.0.1:3000', // TODO: Set dynamically
      cancel_url: 'http://127.0.0.1:3000/subscribe?status=warning', // TODO: Set dynamically
      customer,
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
    });

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };
    return stripeSession;
  }

  public async createBillingPortalSession({
    stripeCustomerId,
  }: CreateStripeBillingPortalSessionParams): Promise<StripeSession> {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: 'http://127.0.0.1:3000/settings',
    });
    const billingPortalSession = {
      id: session.id,
      url: session.url,
    };
    return billingPortalSession;
  }
}
