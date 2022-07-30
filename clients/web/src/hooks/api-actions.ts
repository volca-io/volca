import { useRecoilState } from 'recoil';
import { loading } from '../state/loading';

export const useApiActions = () => {
  const [, setLoading] = useRecoilState(loading);
  const executeApiCall = async ({
    action,
    errorMessage = null,
    successMessage = null,
  }: {
    action: Function;
    errorMessage: string | null;
    successMessage: string | null;
  }) => {
    setLoading(true);
    try {
      await action();
      if (successMessage) {
        console.log(successMessage); // TODO: Trigger alert
      }
    } catch (error) {
      if (errorMessage) {
        console.log(errorMessage); // TODO: Trigger alert
      }
      console.error(error);
    }
    setLoading(false);
  };

  return { executeApiCall };
};
