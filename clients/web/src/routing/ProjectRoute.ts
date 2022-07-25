import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentProject } from '../state';

interface ProjectRouteProps {
  children: React.ReactElement;
}

export const ProjectRoute: React.FC<ProjectRouteProps> = ({ children }) => {
  const project = useRecoilValue(currentProject);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!project?.admin?.has_active_subscription) {
      navigate(`/projects`);
    }
  }, [navigate, project, location]);

  return children;
};
