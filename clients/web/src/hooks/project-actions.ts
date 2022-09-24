import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { projects as projectsState, selectedProject as selectedProjectState } from '../state/projects';
import { Project } from '../types';
import { useApiActions } from './api-actions';

export const useProjectActions = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useRecoilState(projectsState);
  const [selectedProject, setSelectedProject] = useRecoilState(selectedProjectState);
  const { executeApiCall } = useApiActions();

  const getProject = async (id: string) =>
    executeApiCall<Project>({
      action: () => ApiClient.getProject(id),
      onError: () => navigate('/'),
      errorMessage: 'Failed to load project. Refresh to try again.',
    });

  const updateProject = async (data: Partial<Project>) =>
    executeApiCall({
      action: () => ApiClient.updateProject(data),
      onSuccess: (project: Project) => {
        if (project.id === selectedProject?.id) {
          setSelectedProject(project);
        }
        setProjects(projects.map((p) => (p.id === project.id ? project : p)));
      },
      errorMessage: 'Failed to update project',
      successMessage: 'Successfully updated project',
    });

  const deleteProject = async (id: string) =>
    executeApiCall({
      action: () => ApiClient.deleteProject(id),
      onSuccess: () => {
        setProjects(projects.filter((p) => p.id !== id));
        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }
        navigate('/');
      },
      errorMessage: 'Failed to delete project',
      successMessage: 'Successfully deleted project',
    });

  return {
    getProject: useCallback(getProject, [executeApiCall, navigate]),
    updateProject: useCallback(updateProject, [
      setProjects,
      setSelectedProject,
      selectedProject,
      executeApiCall,
      projects,
    ]),
    deleteProject: useCallback(deleteProject, [
      setProjects,
      setSelectedProject,
      selectedProject,
      executeApiCall,
      projects,
      navigate,
    ]),
  };
};
