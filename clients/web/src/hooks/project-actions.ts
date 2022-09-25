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
    await executeApiCall<Project>({
      action: () => ApiClient.getProject(id),
      onError: () => navigate('/'),
      errorMessage: 'Failed to load project, refresh to try again',
    });

  const createProject = async ({ name }: { name: string }) =>
    await executeApiCall({
      action: () => ApiClient.createProject({ name }),
      onSuccess: (project: Project) => {
        setProjects([...projects, project]);
        setSelectedProject(project);
      },
      errorMessage: 'Failed to create project',
      successMessage: 'Project created',
    });

  const updateProject = async (data: Partial<Project>) =>
    await executeApiCall({
      action: () => ApiClient.updateProject(data),
      onSuccess: (project: Project) => {
        if (project.id === selectedProject?.id) {
          setSelectedProject(project);
        }
        setProjects(projects.map((p) => (p.id === project.id ? project : p)));
      },
      errorMessage: 'Failed to update project',
      successMessage: 'Project saved',
    });

  const deleteProject = async (id: string) =>
    await executeApiCall({
      action: () => ApiClient.deleteProject(id),
      onSuccess: () => {
        setProjects(projects.filter((p) => p.id !== id));
        if (selectedProject?.id === id) {
          setSelectedProject(null);
        }
        navigate('/');
      },
      errorMessage: 'Failed to delete project',
      successMessage: 'Project deleted',
    });

  return {
    getProject: useCallback(getProject, [executeApiCall, navigate]),
    createProject: useCallback(createProject, [setProjects, setSelectedProject, executeApiCall, projects]),
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
