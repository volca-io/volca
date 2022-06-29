import { injectable, inject } from 'inversify';
import { DI_TYPES } from '../types/dependency-injection';
import {
  AuthenticationService as AuthenticationServiceInterface,
  UserService as UserServiceInterface,
} from '../interfaces';

@injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  public constructor(@inject(DI_TYPES.UserService) private userService: UserServiceInterface) {}

  public async authenticatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.userService.findByEmail(email);
    console.log(password);

    return !!user;
  }
}
