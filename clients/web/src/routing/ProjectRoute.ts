import React, { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useProjectActions } from '../hooks';
import { selectedProjectState } from '../state';

interface ProjectRouteProps {
  children: React.ReactElement;
}

export const ProjectRoute: React.FC<ProjectRouteProps> = ({ children }) => {
  const [selectedProject, setSelectedProject] = useRecoilState(selectedProjectState);
  const { getProject } = useProjectActions();
  const { id } = useParams();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setProject = async () => {
      if (selectedProject && id && id !== selectedProject.id) {
        const project = await getProject(id);
        if ((project && !project.admin?.has_active_subscription) || !project) {
          navigate('/');
          return;
        }
        if (project) {
          setSelectedProject(project);
          return;
        }
      }
    };
    setProject();
  }, [navigate, location, setSelectedProject, id, getProject, selectedProject]);

  return children;
};
