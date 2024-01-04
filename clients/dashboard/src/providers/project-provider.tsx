import React, { useContext, createContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { LoadingPage } from '../pages';
import { useApiActions } from '../hooks/api-actions';
import { Project } from '../types';
import { useNavigate } from 'react-router-dom';
import { ErrorPage } from '../pages/error-page';
import { useAuthContext } from './authentication-provider';

interface ProjectProviderProps {
  projects: Project[];
  selectedProject: Project | null;
  setSelectedProject: (val: Project | null) => void;
}

const ProjectContext = createContext<ProjectProviderProps | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { createApiAction } = useApiActions();
  const { user } = useAuthContext();
  const localStorageKey = 'selectedProjectId';
  const [selectedId, setSelectedId] = useState(localStorage.getItem(localStorageKey));
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (selectedId) {
      localStorage.setItem(localStorageKey, selectedId);
    } else {
      localStorage.removeItem(localStorageKey);
    }
  }, [selectedId]);

  const enabled = !!user;

  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    enabled,
    queryKey: ['projects'],
    queryFn: () =>
      createApiAction<Project[]>(async ({ client }) => {
        const { projects } = await client.get('projects').json<{ projects: Project[] }>();
        return projects;
      }),
  });

  const setSelectedProject = (project: Project | null) => {
    setSelectedId(project ? project.id : null);

    if (project) {
      navigate(`/projects/${project.id}/dashboard`);
    } else {
      queryClient.clear();
    }
  };

  if (isLoading && enabled) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <ProjectContext.Provider
      value={{
        projects: projects || [],
        selectedProject: selectedId && projects ? projects.find((project) => project.id === selectedId) || null : null,
        setSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectContext = (): ProjectProviderProps => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('Failed to load project context. Make sure you are consuming the context within a provider block');
  }

  return context;
};
