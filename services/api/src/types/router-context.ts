import { RouterContext } from '@koa/router';
import { User } from '../entities';

export interface CustomContext extends RouterContext {
  correlationId: string;
  user: User;
}
