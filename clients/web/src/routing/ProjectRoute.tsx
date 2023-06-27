import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsContext } from '../providers';
import { SubscriptionRoute } from './SubscriptionRoute';

interface ProjectRouteProps {
  children: React.ReactElement;
}

export const ProjectRoute: React.FC<ProjectRouteProps> = ({ children }) => {
  const { selectedProject } = useProjectsContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedProject) {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  return <SubscriptionRoute>{children}</SubscriptionRoute>;
};
