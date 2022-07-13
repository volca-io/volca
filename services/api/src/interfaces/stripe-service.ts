export type CreateStripeSessionParams = {
  userId: string;
  email: string;
};

export type StripeSession = {
  id: string;
  url: string;
};

export interface StripeService {
  createSession(input: CreateStripeSessionParams): Promise<StripeSession>;
}
