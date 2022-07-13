import { User } from '../entities';

export interface AccessTokenCookieSettings {
  secure: boolean;
  httpOnly: boolean;
  sameSite: 'lax';
  domain?: string;
}

export interface AuthenticationService {
  verifyPassword(username: string, password: string): Promise<User>;
  generateAccessToken(user: User): string;
  getAccessTokenCookieSettings(): AccessTokenCookieSettings;
}
