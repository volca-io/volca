import { injectable, inject } from 'inversify';
import { DI_TYPES } from '../types';
import { UserService as UserServiceInterface } from '../interfaces';
import { User } from '../entities';

interface RegisterUserProperties {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@injectable()
export class UserService implements UserServiceInterface {
  public constructor(@inject(DI_TYPES.User) private user: User) {}

  public async findById(id: string): Promise<User | undefined> {
    return this.user.$query().findById(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.user.$query().where({ email });
  }

  public async register({ firstName, lastName, email, password }: RegisterUserProperties): Promise<boolean> {
    console.log({ firstName, lastName, email, password });
    return true;
  }
}
