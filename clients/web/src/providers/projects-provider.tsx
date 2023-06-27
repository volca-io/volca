import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { Project } from '../types';
import { useAuthContext } from './authentication-provider';
import { ListProjectsResponse, useAsyncError } from '../hooks';
import { useApiActions } from '../hooks/api-actions';
import { LoadingPage } from '../pages';

interface ProjectsProviderProps {
  projects: Project[];
  selectedProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setSelectedProject: (project: Project | null) => void;
  fetchProjects: () => Promise<void>;
}

const ProjectsContext = createContext<ProjectsProviderProps | null>(null);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const { executeApiAction } = useApiActions();
  const throwError = useAsyncError();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);

  const fetchProjects = async () => {
    const res = await executeApiAction<Project[]>({
      action: async ({ client }) => (await client.get('projects').json<ListProjectsResponse>()).projects,
      onSuccess: () => {
        setLoading(false);
      },
      onError: (error: any) => {
        throwError(error);
      },
    });

    setProjects(res || []);
    const selectedProjectId = localStorage.getItem('selectedProjectId');
    if (selectedProjectId) {
      setSelectedProject((res || []).find((project) => project.id === selectedProjectId) || null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    } else {
      setProjects([]);
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const setSelectedProject = (project: Project | null) => {
    if (project) {
      localStorage.setItem('selectedProjectId', project.id);
      setSelectedProjectState(project);
    } else {
      setSelectedProjectState(null);
      localStorage.removeItem('selectedProjectId');
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        selectedProject,
        setProjects,
        setSelectedProject,
        fetchProjects,
      }}
    >
      {loading ? <LoadingPage /> : children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsContext = (): ProjectsProviderProps => {
  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error('Failed to load projects context. Make sure you are consuming the context within a provider block');
  }

  return context;
};
