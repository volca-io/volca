import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useToast } from '@chakra-ui/react';

import { ApiError } from '../lib/clients/api-client';
import { loadingState, currentUserState } from '../state';

export const useApiActions = () => {
  const toast = useToast();
  const setLoading = useSetRecoilState(loadingState);
  const setUser = useSetRecoilState(currentUserState);

  const executeApiCall = useCallback(
    async <T>({ action }: { action: Function }): Promise<T> => {
      try {
        return action();
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
          localStorage.removeItem('access_token');
        }
        throw error;
      }
    },
    [setUser]
  );

  const executeApiAction = async <T>({
    action,
    onError,
    onSuccess,
    errorMessage = null,
    successMessage = null,
  }: {
    action: Function;
    onError?: Function;
    onSuccess?: Function;
    errorMessage?: string | null;
    successMessage?: string | null;
  }): Promise<T | void> => {
    setLoading(true);
    try {
      const result = await executeApiCall<T>({ action });
      setLoading(false);
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError();
      if (errorMessage) {
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
    setLoading(false);
  };

  return {
    executeApiAction: useCallback(executeApiAction, [setLoading, toast, executeApiCall]),
  };
};
