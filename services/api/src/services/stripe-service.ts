import Stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';
import { User } from '../entities';
import { EnvironmentConfig, EnvironmentVariables } from '../utils/environment';
import { UserService } from './user-service';
import { PlanId } from '../../../../types/types';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

type CreateStripeSessionParams = {
  user: User;
  planId: PlanId;
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

export class StripeService {
  private stripe: Stripe;

  constructor(private userService: UserService) {
    this.stripe = new Stripe(EnvironmentVariables.STRIPE_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  public listPlans() {
    return EnvironmentConfig.plans;
  }

  public async createSession({ user, planId }: CreateStripeSessionParams): Promise<StripeSession> {
    const plan = this.listPlans().find((plan) => plan.id === planId);

    if (!plan) {
      throw new ServiceError({
        name: ErrorNames.VALIDATION_ERROR,
        message: `Plan ${planId} not found`,
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    const getStripeCustomerId = async () => {
      if (!user.stripeId) {
        const { id: stripeId } = await this.stripe.customers.create({ email: user.email });
        await this.userService.update(user.id, { stripeId });
        return stripeId;
      }

      return user.stripeId;
    };

    const customer = await getStripeCustomerId();

    if (EnvironmentConfig.testCardEnabled) {
      await this.createTestCard({ user, customer });
    }

    const appDomain = EnvironmentVariables.APP_DOMAIN;

    const session = await this.stripe.checkout.sessions.create({
      success_url: `${appDomain}/projects/create`,
      cancel_url: `${appDomain}/onboarding?status=warning`,
      customer,
      mode: 'subscription',
      line_items: [
        {
          price: plan.stripePriceId,
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
              trial_period_days: EnvironmentConfig.freeTrialDays,
            },
          }),
    });

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };

    // Set user as subscribed in local environment since we can't receive the webhook from stripe.
    const environment = EnvironmentVariables.ENVIRONMENT;
    if (environment === 'local') {
      this.userService.setSubscribed({ userId: user.id, planId, hasActiveSubscription: true });
    }

    return stripeSession;
  }

  public async createBillingPortalSession({
    stripeCustomerId,
  }: CreateStripeBillingPortalSessionParams): Promise<StripeSession> {
    const appDomain = EnvironmentVariables.APP_DOMAIN;
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
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      confirm: true,
      payment_method: paymentMethod.id,
    });

    // Attach the card to the customer
    await this.stripe.paymentMethods.attach(paymentMethod.id, { customer });

    // Set as default payment method
    await this.stripe.customers.update(customer, { invoice_settings: { default_payment_method: paymentMethod.id } });
  }

  public async verifyWebhookSignature({ body, signature }: VerifyStripeWebhookSignatureParams) {
    const webhookSecret = await EnvironmentVariables.STRIPE_WEBHOOK_SECRET;
    return this.stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  }
}
