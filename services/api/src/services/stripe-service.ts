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

type CreateCardParams = {
  user: User;
  customer: string;
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
    const appDomain = this.environment.getWebappDomain();

    if (this.environment.get(EnvironmentVariable.TEST_CARD_ENABLED) === '1') {
      await this.createTestCard({ user, customer });
    }

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

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };
    return stripeSession;
  }

  public async createBillingPortalSession({
    stripeCustomerId,
  }: CreateStripeBillingPortalSessionParams): Promise<StripeSession> {
    const appDomain = this.environment.getWebappDomain();
    const session = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${appDomain}/settings`,
    });
    const billingPortalSession = {
      id: session.id,
      url: session.url,
    };
    return billingPortalSession;
  }

  private async createTestCard({ user, customer }: CreateCardParams) {
    // Create the card
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      billing_details: {
        address: {
          country: 'US',
          postal_code: '90210',
        },
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
      card: {
        number: '4242424242424242',
        exp_month: 12,
        exp_year: 34,
        cvc: '424',
      },
    });

    // Set the card up for future usage
    await this.stripe.setupIntents.create({
      confirm: true,
      payment_method: paymentMethod.id,
    });

    // Attach the card to the customer
    await this.stripe.paymentMethods.attach(paymentMethod.id, { customer });

    // Set as default payment method
    await this.stripe.customers.update(customer, { invoice_settings: { default_payment_method: paymentMethod.id } });
  }

  public async verifyWebhookSignature({ body, signature }: VerifyStripeWebhookSignatureParams) {
    return this.stripe.webhooks.constructEventAsync(
      body,
      signature,
      this.environment.getOrFail(EnvironmentVariable.STRIPE_WEBHOOK_SECRET)
    );
  }
}
