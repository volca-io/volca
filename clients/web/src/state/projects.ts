import { atom, selector, DefaultValue } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';

export const projectsSelector = selector<Project[]>({
  key: 'projects-selector',
  get: async ({ get }) => {
    const projects = await ApiClient.getProjects();
    return projects;
  },
});

export const currentProjectSelector = selector<Project | null>({
  key: 'current-project-selector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;

    if (newValue) {
      localStorage.setItem('selected_project_id', newValue.id);
    } else {
      localStorage.removeItem('selected_project_id');
    }

    set(currentProject, newValue);
  },
  get: async ({ get }) => {
    const id = localStorage.getItem('selected_project_id');
    if (!id) return null;

    const res = await ApiClient.getProject(id);
    return res;
  },
});

export const projects = atom<Project[]>({
  key: 'projects',
  default: projectsSelector,
});

export const currentProject = atom<Project | null>({
  key: 'current-project',
  default: currentProjectSelector,
});
