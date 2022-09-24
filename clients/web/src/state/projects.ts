import { atom, DefaultValue, selector } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { Project } from '../types';

const selectedProjectSelector = selector<Project | null>({
  key: 'selected-project-selector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;

    if (newValue) {
      localStorage.setItem('selected_project_id', newValue.id);
    } else {
      localStorage.removeItem('selected_project_id');
    }

    set(selectedProject, newValue);
  },
  get: async ({ get }) => {
    const id = localStorage.getItem('selected_project_id');
    if (!id) return null;

    try {
      return await ApiClient.getProject(id);
    } catch (error) {
      return null;
    }
  },
});

const projectListSelector = selector<Project[]>({
  key: 'project-list-selector',
  get: () => ApiClient.getProjects(),
});

export const selectedProject = atom<Project | null>({
  key: 'selected-project',
  default: selectedProjectSelector,
});

export const projects = atom<Project[]>({
  key: 'projects',
  default: projectListSelector,
});
