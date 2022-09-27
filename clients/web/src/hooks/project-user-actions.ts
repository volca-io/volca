import { useCallback } from 'react';

import { ApiClient } from '../lib/clients/api-client';
import { ProjectInvitation, User } from '../types';
import { useApiActions } from './api-actions';

export const useProjectUserActions = () => {
  const { executeApiAction } = useApiActions();

  const getProjectUsers = async (projectId: string) =>
    await executeApiAction<User[]>({
      action: () => ApiClient.getProjectUsers(projectId),
      errorMessage: 'Failed to load users',
    });

  const createProjectInvitation = async (data: { toUserEmail: string; projectId: string }) =>
    await executeApiAction<ProjectInvitation>({
      action: () => ApiClient.createProjectInvitation(data),
      successMessage: '',
      errorMessage: 'Failed to create project invitation',
    });

  const acceptProjectInvitation = async (key: string) =>
    await executeApiAction<void>({
      action: () => ApiClient.acceptProjectInvitation({ key }),
      errorMessage: 'Something went wrong, make sure your invitation is still valid',
    });

  const deleteProjectUser = async (projectId: string, userId: string) =>
    await executeApiAction<void>({
      action: () => ApiClient.deleteProjectUser(projectId, userId),
      errorMessage: 'Failed to delete user',
    });

  return {
    getProjectUsers: useCallback(getProjectUsers, [executeApiAction]),
    acceptProjectInvitation: useCallback(acceptProjectInvitation, [executeApiAction]),
    createProjectInvitation: useCallback(createProjectInvitation, [executeApiAction]),
    deleteProjectUser: useCallback(deleteProjectUser, [executeApiAction]),
  };
};
