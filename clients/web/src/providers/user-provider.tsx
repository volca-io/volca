import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';

export type UserContextProps = {
  firstName?: string | null;
  lastName?: string | null;
  selectedProject?: Project | null;
  setSelectedProject: (project: Project) => void;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext({
  firstName: null,
  lastName: null,
  selectedProject: null,
  setSelectedProject: () => {},
} as UserContextProps);

export const UserConsumer = UserContext.Consumer;

export const UserProvider = ({ children }: UserProviderProps) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedProject, setSelectedProject] = useState(null as Project | null);
  useEffect(() => {
    const getProjects = async () => {
      const selectedProjectId = localStorage.getItem('selectedProjectId');
      const projects = await ApiClient.getProjects();
      const { first_name, last_name } = await ApiClient.getMe();
      setFirstName(firstName);
      setLastName(lastName);
      setSelectedProject(
        selectedProjectId ? projects.find((project) => project.id === selectedProjectId) || projects[0] : projects[0]
      );
      if (projects.length === 0) {
        navigate('/projects');
      }
    };
    getProjects();
  }, [navigate]);

  return (
    <UserContext.Provider
      value={{
        firstName,
        lastName,
        selectedProject,
        setSelectedProject,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
