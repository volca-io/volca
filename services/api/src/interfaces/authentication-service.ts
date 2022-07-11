import { User } from '../entities';

export interface AuthenticationService {
  verifyPassword(username: string, password: string): Promise<User>;
}
