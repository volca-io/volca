export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  has_active_subscription: boolean;
  free_trial_activated: boolean;
  plan_id: string;
  verified_at: Date;
  created_at: Date;
  updated_at: Date;
  role?: string;
};
