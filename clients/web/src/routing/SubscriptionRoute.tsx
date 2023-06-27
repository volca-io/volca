import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsContext, useAuthContext } from '../providers';
import { AuthenticatedRoute } from './AuthenticatedRoute';

interface SubscriptionRouteProps {
  children: React.ReactElement;
}

export const SubscriptionRoute: React.FC<SubscriptionRouteProps> = ({ children }) => {
  const { user } = useAuthContext();
  const { projects } = useProjectsContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(user?.hasActiveSubscription || projects.some((project) => project.owner.hasActiveSubscription))) {
      navigate('/onboarding');
    }
  }, [navigate, user, projects]);

  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
};
