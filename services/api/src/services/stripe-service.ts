import { injectable } from 'tsyringe';
import Stripe from 'stripe';
import { User } from '../entities';
import { EnvironmentConfig, EnvironmentVariables } from '../utils/environment';
import { UserService } from './user-service';
import { PlanId } from '../../../../config/types';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';
import { StatusCodes } from 'http-status-codes';

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

@injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private userService: UserService) {
    this.stripe = new Stripe(EnvironmentVariables.STRIPE_KEY, {
      apiVersion: '2020-08-27',
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
        this.userService.update(user.id, { stripeId });
        return stripeId;
      }

      return user.stripeId;
    };

    const customer = await getStripeCustomerId();

    if (EnvironmentVariables.TEST_CARD_ENABLED === '1') {
      await this.createTestCard({ user, customer });
    }

    const session = await this.stripe.checkout.sessions.create({
      success_url: EnvironmentVariables.APP_DOMAIN,
      cancel_url: `${EnvironmentVariables.APP_DOMAIN}/onboarding?status=warning`,
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
              trial_period_days: parseInt(EnvironmentVariables.FREE_TRIAL_DAYS),
            },
          }),
    });

    const stripeSession = {
      id: session.id,
      url: session.url || '',
    };

    // Set user as subscribed in local environment since we can't receive the webhook from stripe.
    if (EnvironmentVariables.ENVIRONMENT === 'local') {
      this.userService.setSubscribed({ userId: user.id, planId, hasActiveSubscription: true });
    }

    return stripeSession;
  }

  public async createBillingPortalSession({
    stripeCustomerId,
  }: CreateStripeBillingPortalSessionParams): Promise<StripeSession> {
    const session = await this.stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${EnvironmentVariables.APP_DOMAIN}/settings`,
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
    return this.stripe.webhooks.constructEventAsync(body, signature, EnvironmentVariables.STRIPE_WEBHOOK_SECRET);
  }
}
