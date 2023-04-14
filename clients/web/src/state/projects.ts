import { atom, DefaultValue, selector } from 'recoil';
import { getClient } from '../lib/api-client';
import { Project } from '../types';
import { currentUserState } from './current-user';
import { ListProjectsResponse } from '../hooks/project-actions';

const defaultProjectsSelector = selector<Project[]>({
  key: 'project-list-selector',
  get: async ({ get }) => {
    try {
      const currentUser = get(currentUserState);
      if (currentUser) {
        const projectsResponse = await getClient().get('projects').json<ListProjectsResponse>();
        return projectsResponse.projects;
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  },
});

export const projectsState = atom<Project[]>({
  key: 'projects',
  default: defaultProjectsSelector,
});

const selectedProjectState = atom<string | null>({
  key: 'select-project',
  default: localStorage.getItem('selected_project_id'),
});

export const selectedProjectSelector = selector<Project | null>({
  key: 'selected-project-selector',
  set: ({ set }, newValue) => {
    if (newValue instanceof DefaultValue) return;

    if (newValue) {
      localStorage.setItem('selected_project_id', newValue.id);
    } else {
      localStorage.removeItem('selected_project_id');
    }

    set(selectedProjectState, newValue ? newValue.id : null);
  },
  get: ({ get }) => {
    const projects = get(projectsState);
    const selectedId = get(selectedProjectState);

    if (!selectedId) {
      return null;
    }
    return projects.find((project) => project.id === selectedId) || null;
  },
});
