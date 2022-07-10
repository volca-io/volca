import { RouterContext } from '@koa/router';
import { User } from 'src/entities';

export interface CustomContext extends RouterContext {
  correlationId: string;
  user: User;
}
