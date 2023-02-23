import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { projectsState, selectedProjectSelector } from '../state';
import { Project } from '../types';
import { useApiActions } from './api-actions';

export const useProjectActions = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useRecoilState(projectsState);
  const [selectedProject, setSelectedProject] = useRecoilState(selectedProjectSelector);
  const { executeApiAction } = useApiActions();

  const getProject = async (id: string) =>
    await executeApiAction<Project>({
      action: () => ApiClient.getProject(id),
      onError: () => navigate('/'),
      errorMessage: 'Failed to load project, refresh to try again',
    });

  const createProject = async ({ name }: { name: string }) =>
    await executeApiAction({
      action: () => ApiClient.createProject({ name }),
      onSuccess: (project: Project) => {
        setProjects([...projects, project]);
        setSelectedProject(project);
        navigate(`/projects/${project.id}/dashboard`);
      },
      errorMessage: 'Failed to create project',
      successMessage: 'Project created',
    });

  const updateProject = async (data: Partial<Project>) =>
    await executeApiAction({
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
    await executeApiAction({
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
    getProject: useCallback(getProject, [executeApiAction, navigate]),
    createProject: useCallback(createProject, [setProjects, setSelectedProject, executeApiAction, navigate, projects]),
    updateProject: useCallback(updateProject, [
      setProjects,
      setSelectedProject,
      selectedProject,
      executeApiAction,
      projects,
    ]),
    deleteProject: useCallback(deleteProject, [
      setProjects,
      setSelectedProject,
      selectedProject,
      executeApiAction,
      projects,
      navigate,
    ]),
  };
};
