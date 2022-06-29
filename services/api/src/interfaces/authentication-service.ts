export interface AuthenticationService {
  authenticatePassword(username: string, password: string): Promise<boolean>;
}
