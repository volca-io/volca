export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  hasActiveSubscription: boolean;
  freeTrialActivated: boolean;
  planId: string;
  createdAt: Date;
  updatedAt: Date;
  role?: string;
};
