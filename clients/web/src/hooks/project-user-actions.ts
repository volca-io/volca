import { useCallback } from 'react';

import { getClient } from '../lib/api-client';
import { ProjectInvitation, User } from '../types';
import { useApiActions } from './api-actions';

type GetProjectUsersResponse = {
  users: User[];
};

type CreateProjectInvitationResponse = {
  project_invitation: ProjectInvitation;
};

export const useProjectUserActions = () => {
  const { executeApiAction } = useApiActions();

  const getProjectUsers = async (projectId: string) =>
    await executeApiAction<User[]>({
      action: async () => (await getClient().get(`projects/${projectId}/users`).json<GetProjectUsersResponse>()).users,
      errorMessage: 'Failed to load users',
    });

  const createProjectInvitation = async ({ toUserEmail, projectId }: { toUserEmail: string; projectId: string }) =>
    await executeApiAction<ProjectInvitation>({
      action: () =>
        getClient()
          .post('project-invitations', { json: { project_id: projectId, to_user_email: toUserEmail } })
          .json<CreateProjectInvitationResponse>(),
      successMessage: '',
      errorMessage: 'Failed to create project invitation',
    });

  const acceptProjectInvitation = async (key: string) =>
    await executeApiAction<void>({
      action: () => getClient().get(`project-invitations/${key}`).json(),
      errorMessage: 'Something went wrong, make sure your invitation is still valid',
    });

  const deleteProjectUser = async (projectId: string, userId: string) =>
    await executeApiAction<void>({
      action: () => getClient().delete(`projects/${projectId}/users/${userId}`),
      errorMessage: 'Failed to delete user',
    });

  return {
    getProjectUsers: useCallback(getProjectUsers, [executeApiAction]),
    acceptProjectInvitation: useCallback(acceptProjectInvitation, [executeApiAction]),
    createProjectInvitation: useCallback(createProjectInvitation, [executeApiAction]),
    deleteProjectUser: useCallback(deleteProjectUser, [executeApiAction]),
  };
};
