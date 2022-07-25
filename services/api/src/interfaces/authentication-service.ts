import { User } from '../entities';

export type AccessTokenCookieSettings = {
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'lax';
  domain?: string;
};

export type AccessTokenResponse = {
  accessToken: string;
  expiresIn: number;
};

export type SessionResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export interface AuthenticationService {
  verifyPassword(username: string, password: string): Promise<User>;
  getRefreshTokenCookieConfiguration(): AccessTokenCookieSettings;
  createNewSession(user: User): Promise<SessionResponse>;
}
