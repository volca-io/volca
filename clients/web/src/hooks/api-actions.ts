import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { ApiError } from '../lib/clients/api-client';
import { loading } from '../state/loading';
import { message } from '../state/message';
import { currentUser } from '../state/current-user';

export const useApiActions = () => {
  const [, setLoading] = useRecoilState(loading);
  const [, setMessage] = useRecoilState(message);
  const [, setUser] = useRecoilState(currentUser);

  const executeApiCall = useCallback(
    async <T>({ action }: { action: Function }): Promise<T> => {
      try {
        return action();
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
          setUser(null);
          localStorage.removeItem('access-token');
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
        setMessage(successMessage);
      }
      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      if (onError) onError();
      if (errorMessage) {
        setMessage(errorMessage);
      }
    }
    setLoading(false);
  };

  return {
    executeApiCall,
    executeApiAction: useCallback(executeApiAction, [setLoading, setMessage, executeApiCall]),
  };
};
