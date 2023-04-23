import ky, { NormalizedOptions } from 'ky';
import jwt_decode from 'jwt-decode';

export type AccessToken = {
  exp: number;
  sub: string;
};

type ApiErrorInterface = {
  name: string;
  message: string;
  status: number;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

export class ApiError extends Error implements ApiErrorInterface {
  public readonly name: string;
  public readonly status: number;

  constructor({ name, message, status }: { name: string; message: string; status: number }) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

const tokenNeedsRefresh = (accessToken: string | null) => {
  if (!accessToken) {
    return true;
  }

  const decoded = jwt_decode<AccessToken>(accessToken);
  const expires = new Date(decoded.exp);

  const isAboutToExpire = expires.getTime() * 1000 + 10000 < new Date().getTime();
  return isAboutToExpire;
};

const refreshToken = async (): Promise<string> => {
  const { access_token } = await client.post('authn/refresh').json<TokenResponse>();
  return access_token;
};

const isCustomApiError = (error: Record<string, unknown>) =>
  ['name', 'message'].every((item) => error.hasOwnProperty(item));

const tokenHook = async (request: Request) => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const token = tokenNeedsRefresh(accessToken) ? await refreshToken() : accessToken;
    request.headers.set('authorization', `Bearer ${token}`);
  }
};

const errorHook = async (_request: Request, _options: NormalizedOptions, response: Response) => {
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
};

const client = ky.create({
  prefixUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
  mode: 'cors',
});

export const apiClient = client.extend({
  hooks: {
    beforeRequest: [tokenHook],
    afterResponse: [errorHook],
  },
});

export const publicApiClient = client.extend({
  hooks: {
    beforeRequest: [],
    afterResponse: [errorHook],
  },
});
