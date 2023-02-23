import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../state';
import { AuthenticatedRoute } from './AuthenticatedRoute';

interface SubscriptionRouteProps {
  children: React.ReactElement;
}

export const SubscriptionRoute: React.FC<SubscriptionRouteProps> = ({ children }) => {
  const user = useRecoilValue(currentUserState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.has_active_subscription) {
      navigate('/onboarding');
    }
  }, [navigate, user?.has_active_subscription]);

  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
};
