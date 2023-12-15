export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  cognitoIdentityId: string;
  role?: string;
  planId: string;
  hasActiveSubscription: boolean;
  createdAt: Date;
  updatedAt: Date;
};
