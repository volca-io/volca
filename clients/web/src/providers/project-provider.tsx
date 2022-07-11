import { createContext, useEffect, useState } from 'react';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';

export type ProjectContextProps = {
  selectedProject?: Project | null;
  setSelectedProject: (project: Project) => void;
};

interface ProjectProviderProps {
  children: React.ReactNode;
}

export const ProjectContext = createContext({
  selectedProject: null,
  setSelectedProject: () => {},
} as ProjectContextProps);

export const ProjectConsumer = ProjectContext.Consumer;

export const ProjectProvider = ({ children }: ProjectProviderProps) => {
  const STORAGE_KEY = 'selected_project_id';
  const [initialized, setInitialized] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const doSetSelectedProject = (project: Project) => {
    localStorage.setItem(STORAGE_KEY, project.id);
    setSelectedProject(project);
    console.log('setting project', project);
  };

  useEffect(() => {
    const getProjects = async () => {
      const selectedProjectId = localStorage.getItem(STORAGE_KEY);

      try {
        const projects = await ApiClient.getProjects();
        setSelectedProject(
          selectedProjectId ? projects.find((project) => project.id === selectedProjectId) || projects[0] : projects[0]
        );
      } catch (err: unknown) {
        console.error(err);
      }

      setInitialized(true);
    };

    getProjects();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject: doSetSelectedProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
