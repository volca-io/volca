import { injectable } from 'tsyringe';
import Stripe from 'stripe';
import { User } from '../entities';
import { EnvironmentUtils, EnvironmentVariable } from '../utils/environment';

type CreateStripeSessionParams = {
  user: User;
};

type CreateStripeBillingPortalSessionParams = {
  stripeCustomerId: string;
};

type VerifyStripeWebhookSignatureParams = {
  body: string;
  signature: string;
};

type StripeSession = {
  id: string;
  url: string;
};

@injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private environment: EnvironmentUtils) {
    this.stripe = new Stripe(this.environment.getOrFail(EnvironmentVariable.STRIPE_KEY), {
      apiVersion: '2020-08-27',
    });
  }

  public async createSession({ user }: CreateStripeSessionParams): Promise<StripeSession> {
    const getStripeCustomerId = async () => {
      if (!user.stripeId) {
        const { id: stripeId } = await this.stripe.customers.create({ email: user.email });
        await User.query().where({ id: user.id }).update({ stripeId });
        return stripeId;
      }
      return user?.stripeId;
    };

    const customer = await getStripeCustomerId();
    const appDomain = `https://${this.environment.getOrFail(EnvironmentVariable.APP_DOMAIN)}`;

    const session = await this.stripe.checkout.sessions.create({
      success_url: appDomain,
      cancel_url: `${appDomain}/subscribe?status=warning`,
      customer,
      mode: 'subscription',
      line_items: [
        {
          price: this.environment.getOrFail(EnvironmentVariable.STRIPE_PRICE_ID),
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
      },
      ...(user.freeTrialActivated
        ? {}
        : {
            subscription_data: {
              trial_period_days: 7, // TODO: Make configurable
            },
          }),
    });

    if (this.environment.getOrFail(EnvironmentVariable.STAGE)) {
      await User.query().findById(user.id).update({ hasActiveSubscription: true });
    }

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };
    return stripeSession;
  }

  public async createBillingPortalSession({
    stripeCustomerId,
  }: CreateStripeBillingPortalSessionParams): Promise<StripeSession> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: 'http://127.0.0.1:3000/settings',
    });
    if (this.environment.getOrFail(EnvironmentVariable.STAGE)) {
      await User.query().where({ stripeId: stripeCustomerId }).update({ hasActiveSubscription: false });
    }
    const billingPortalSession = {
      id: session.id,
      url: session.url,
    };
    return billingPortalSession;
  }

  public async verifyWebhookSignature({ body, signature }: VerifyStripeWebhookSignatureParams) {
    return this.stripe.webhooks.constructEventAsync(
      body,
      signature,
      this.environment.getOrFail(EnvironmentVariable.STRIPE_KEY)
    );
  }
}
