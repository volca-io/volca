import { useCallback } from 'react';
import { ProjectInvitation, User } from '../types';
import { useApiActions } from './api-actions';

type GetProjectUsersResponse = {
  users: User[];
};

type CreateProjectInvitationResponse = {
  projectInvitation: ProjectInvitation;
};

export const useProjectUserActions = () => {
  const { executeApiAction } = useApiActions();

  const getProjectUsers = async (projectId: string) =>
    await executeApiAction<User[]>({
      action: async ({ client }) =>
        (
          await client.get(`projects/${projectId}/users`).json<GetProjectUsersResponse>()
        ).users,
      errorMessage: 'Failed to load users',
    });

  const createProjectInvitation = async ({ projectId }: { projectId: string }) =>
    await executeApiAction<ProjectInvitation>({
      action: async ({ client }) =>
        (
          await client.post('project-invitations', { json: { projectId } }).json<CreateProjectInvitationResponse>()
        ).projectInvitation,
      errorMessage: 'Failed to create project invitation',
    });

  const deleteProjectUser = async (projectId: string, userId: string) =>
    await executeApiAction<void>({
      action: async ({ client }) => {
        await client.delete(`projects/${projectId}/users/${userId}`);
      },
      errorMessage: 'Failed to delete user',
    });

  const updateProjectUser = async (projectId: string, userId: string, role: string) =>
    await executeApiAction<void>({
      action: async ({ client }) => {
        await client.put(`projects/${projectId}/users/${userId}`, { json: { role } });
      },
      errorMessage: 'Failed to set role',
      successMessage: 'Role updated',
    });

  return {
    getProjectUsers: useCallback(getProjectUsers, [executeApiAction]),
    createProjectInvitation: useCallback(createProjectInvitation, [executeApiAction]),
    deleteProjectUser: useCallback(deleteProjectUser, [executeApiAction]),
    updateProjectUser: useCallback(updateProjectUser, [executeApiAction]),
  };
};
