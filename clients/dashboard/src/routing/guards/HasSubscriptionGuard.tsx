import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../providers';

export const HasSubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();

  const userHasSubscription = user && user.hasActiveSubscription;

  if (!userHasSubscription) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};
