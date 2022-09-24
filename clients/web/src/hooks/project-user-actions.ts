import { useCallback } from 'react';

import { ApiClient } from '../lib/clients/api-client';
import { ProjectInvitation } from '../types';
import { useApiActions } from './api-actions';

export const useProjectUserActions = () => {
  const { executeApiCall } = useApiActions();

  const createProjectInvitation = async (data: { toUserEmail: string; projectId: string }) =>
    await executeApiCall<ProjectInvitation>({
      action: () => ApiClient.createProjectInvitation(data),
      errorMessage: 'Failed to create project invitation.',
    });

  const acceptProjectInvitation = async (key: string) =>
    await executeApiCall<void>({
      action: () => ApiClient.acceptProjectInvitation({ key }),
      errorMessage: 'Something went wrong. Make sure your invitation is still valid.',
    });

  const deleteProjectUser = async (projectId: string, userId: string) =>
    await executeApiCall<void>({
      action: () => ApiClient.deleteProjectUser(projectId, userId),
      errorMessage: 'Failed to delete user.',
    });

  return {
    acceptProjectInvitation: useCallback(acceptProjectInvitation, [executeApiCall]),
    createProjectInvitation: useCallback(createProjectInvitation, [executeApiCall]),
    deleteProjectUser: useCallback(deleteProjectUser, [executeApiCall]),
  };
};
