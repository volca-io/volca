import { useCallback } from 'react';
import ky, { NormalizedOptions } from 'ky';
import { Auth } from 'aws-amplify';
import { useAppConfigContext } from '../providers';

type ApiErrorInterface = {
  name: string;
  message: string;
  status: number;
};

type ExecuteApiCallAction<T> = ({ client, publicClient }: { client: typeof ky; publicClient: typeof ky }) => Promise<T>;

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
  const { config } = useAppConfigContext();

  const errorHook = useCallback(async (_request: Request, _options: NormalizedOptions, response: Response) => {
    if (!response.ok) {
      const body = await response.json();

      if (body && isApiError(body)) {
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
        prefixUrl: import.meta.env.VITE_API_URL,
        credentials: 'include',
        mode: 'cors',
        retry: {
          limit: 0,
        },
        hooks: {
          afterResponse: [errorHook],
        },
      });

      const tokenHook = async (request: Request) => {
        if (config.mockTokens) {
          request.headers.set('authorization', `Bearer ${config.mockTokens.accessToken}`);
        } else {
          try {
            const session = await Auth.currentSession();
            const token = session.getAccessToken().getJwtToken();
            request.headers.set('authorization', `Bearer ${token}`);
          } catch (err) {
            console.error({ url: request.url, err });
            throw err;
          }
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
        console.error(error);
        if (error instanceof ApiError && error.status === 401) {
          Auth.signOut();
        }
        throw error;
      }
    },
    [errorHook, config.mockTokens]
  );

  const createApiAction = <T>(action: ExecuteApiCallAction<T>): Promise<T | null> => {
    return executeApiCall<T>({ action });
  };

  const isApiError = (error: Record<string, unknown>) =>
    ['name', 'message'].every((item) => Object.keys(error).includes(item));

  return {
    createApiAction,
  };
};