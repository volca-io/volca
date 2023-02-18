import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { currentUserState, selectedProjectSelector } from '../state';
import { SubscriptionRoute } from './SubscriptionRoute';

interface ProjectRouteProps {
  children: React.ReactElement;
}

export const ProjectRoute: React.FC<ProjectRouteProps> = ({ children }) => {
  const [projects] = useRecoilState(currentUserState);
  const [selectedProject] = useRecoilState(selectedProjectSelector);

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProject) {
      navigate('/');
    }
  }, [navigate, projects, selectedProject]);

  return <SubscriptionRoute>{children}</SubscriptionRoute>;
};
