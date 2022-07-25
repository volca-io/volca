import { JwtPayload } from 'jsonwebtoken';

export interface Security {
  hashPassword(password: string): Promise<string>;
  verifyPassword(hash: string, plain: string): Promise<boolean>;
  createAccessToken(payload: Record<string, unknown>, expiresIn: string | number | undefined): string;
  createRefreshToken(): string;
  verifyToken(token: string): JwtPayload;
  decodeToken(token: string): JwtPayload;
}
