import { injectable } from 'inversify';
import argon2 from 'argon2';
import { Security as SecurityInterface } from '../../interfaces';

@injectable()
export class Security implements SecurityInterface {
  public hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}
