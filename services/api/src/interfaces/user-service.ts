import { User } from '../entities';

interface RegisterUserProperties {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserService {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  register(input: RegisterUserProperties): Promise<User>;
}
