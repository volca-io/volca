import { injectable } from 'inversify';

import { StripeSession, CreateStripeSessionParams } from 'src/interfaces/stripe-service';
import { StripeService as StripeServiceInterface } from '../interfaces';
import { User } from '../entities';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY as string, { apiVersion: '2020-08-27' });

@injectable()
export class StripeService implements StripeServiceInterface {
  public async createSession({ userId, email }: CreateStripeSessionParams): Promise<StripeSession> {
    const session = await stripe.checkout.sessions.create({
      success_url: 'https://example.com/success', // TODO
      cancel_url: 'https://example.com/cancel', // TODO
      customer_email: email,
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
      },
    });
    const { customer } = session;
    await User.query()
      .where({ userId })
      .update({ stripeId: typeof customer === 'string' ? customer : customer?.id });

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };
    return stripeSession;
  }
}
