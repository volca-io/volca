import { User } from '../entities';

export type RegisterUserProperties = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UpdateUserProperties = {
  id: string;
  stripeId?: string;
  hasActiveSubscription?: boolean;
  freeTrialActivated?: boolean;
};

export interface UserService {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByStripeId(stripeId: string): Promise<User | undefined>;
  register(input: RegisterUserProperties): Promise<User>;
  update(input: UpdateUserProperties): Promise<User | undefined>;
}
