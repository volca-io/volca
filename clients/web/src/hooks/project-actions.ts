import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { getClient } from '../lib/api-client';
import { projectsState, selectedProjectSelector } from '../state';
import { Project } from '../types';
import { useApiActions } from './api-actions';

export type ListProjectsResponse = {
  projects: Project[];
};

type CreateProjectResponse = {
  project: Project;
};

type UpdateProjectResponse = {
  project: Project;
};

export const useProjectActions = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useRecoilState(projectsState);
  const [selectedProject, setSelectedProject] = useRecoilState(selectedProjectSelector);
  const { executeApiAction } = useApiActions();

  const createProject = async ({ name }: { name: string }) =>
    await executeApiAction({
      action: async () =>
        (
          await getClient().post('projects', { json: { name } }).json<CreateProjectResponse>()
        ).project,
      onSuccess: (project: Project) => {
        setProjects([...projects, project]);
        setSelectedProject(project);
        navigate(`/projects/${project.id}/dashboard`);
      },
      errorMessage: 'Failed to create project',
      successMessage: 'Project created',
    });

  const updateProject = async ({ id, name }: Partial<Project>) =>
    await executeApiAction({
      action: () => getClient().put(`projects/${id}`, { json: { name } }).json<UpdateProjectResponse>(),
      onSuccess: ({ project }: UpdateProjectResponse) => {
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
      action: () => getClient().delete(`projects/${id}`),
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
