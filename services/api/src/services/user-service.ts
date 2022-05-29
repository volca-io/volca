import { injectable } from 'inversify';

@injectable()
export class UserService {
  public findById(): string {
    return 'Hello world!';
  }

  public signUp(): string {
    return 'Hello world!';
  }
}
