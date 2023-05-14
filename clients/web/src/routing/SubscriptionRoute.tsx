import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState, projectsState } from '../state';
import { AuthenticatedRoute } from './AuthenticatedRoute';

interface SubscriptionRouteProps {
  children: React.ReactElement;
}

export const SubscriptionRoute: React.FC<SubscriptionRouteProps> = ({ children }) => {
  const user = useRecoilValue(currentUserState);
  const projects = useRecoilValue(projectsState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!(user?.has_active_subscription || projects.some((project) => project.owner.has_active_subscription))) {
      navigate('/onboarding');
    }
  }, [navigate, user, projects]);

  return <AuthenticatedRoute>{children}</AuthenticatedRoute>;
};
