import { useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import ky, { NormalizedOptions } from 'ky';

import { useAppConfigContext, useLoadingContext } from '../providers';
import { KyInstance } from 'ky/distribution/types/ky';
import { Auth } from 'aws-amplify';

type ApiErrorInterface = {
  name: string;
  message: string;
  status: number;
};

type ExecuteApiCallAction<T> = ({
  client,
  publicClient,
}: {
  client: KyInstance;
  publicClient: KyInstance;
}) => Promise<T>;

export class ApiError extends Error implements ApiErrorInterface {
  public readonly name: string;
  public readonly status: number;

  constructor({ name, message, status }: { name: string; message: string; status: number }) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export const useApiActions = () => {
  const toast = useToast();
  const { setLoading } = useLoadingContext();
  const { config } = useAppConfigContext();

  const errorHook = useCallback(async (_request: Request, _options: NormalizedOptions, response: Response) => {
    if (!response.ok) {
      const body = await response.json();

      if (body && isCustomApiError(body)) {
        throw new ApiError({ name: body.name, message: body.message, status: response.status });
      }

      throw new ApiError({
        name: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred, please try again later',
        status: 500,
      });
    }
  }, []);

  const executeApiCall = useCallback(
    async <T>({ action }: { action: ExecuteApiCallAction<T> }): Promise<T> => {
      const publicClient = ky.create({
        prefixUrl: process.env.REACT_APP_API_URL,
        credentials: 'include',
        mode: 'cors',
        hooks: {
          afterResponse: [errorHook],
        },
      });

      const tokenHook = async (request: Request) => {
        if (config.mockTokens) {
          request.headers.set('authorization', `Bearer ${config.mockTokens.accessToken}`);
        } else {
          const session = await Auth.currentSession();
          const token = session.getAccessToken().getJwtToken();
          request.headers.set('authorization', `Bearer ${token}`);
        }
      };

      const client = publicClient.extend({
        hooks: {
          beforeRequest: [tokenHook],
        },
      });

      try {
        return action({ client, publicClient });
      } catch (error: unknown) {
        if (error instanceof ApiError && error.status === 401) {
          Auth.signOut();
        }
        throw error;
      }
    },
    [errorHook, config.mockTokens]
  );

  const executeApiAction = async <T>({
    action,
    onError,
    onSuccess,
    errorMessage = null,
    successMessage = null,
    errorMessageDuration = 9000,
  }: {
    action: ExecuteApiCallAction<T>;
    onError?: Function;
    onSuccess?: Function;
    errorMessage?: string | null;
    successMessage?: string | null;
    errorMessageDuration?: number | null;
  }): Promise<T | null> => {
    setLoading(true);
    try {
      const result = await executeApiCall<T>({ action });
      if (successMessage) {
        toast({
          title: 'Success',
          description: successMessage,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
      }
      if (onSuccess) await onSuccess(result);
      setLoading(false);
      return result;
    } catch (error) {
      if (onError) await onError(error);
      if (errorMessage) {
        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: errorMessageDuration,
          isClosable: true,
        });
      }
    }
    setLoading(false);
    return null;
  };

  const isCustomApiError = (error: Record<string, unknown>) =>
    ['name', 'message'].every((item) => error.hasOwnProperty(item));

  return {
    executeApiAction: useCallback(executeApiAction, [setLoading, toast, executeApiCall]),
  };
};
