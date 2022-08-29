import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { loading } from '../state/loading';
import { message } from '../state/message';

export const useApiActions = () => {
  const [, setLoading] = useRecoilState(loading);
  const [, setMessage] = useRecoilState(message);
  const executeApiCall = async <T>({
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
      const result = await action();
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

  return { executeApiCall: useCallback(executeApiCall, [setLoading, setMessage]) };
};
