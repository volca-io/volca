import { RouterContext } from '@koa/router';
/* volca-exclude-start os */
import { User } from '../entities';
/* volca-exclude-end os */

export interface CustomContext extends RouterContext {
  correlationId: string;
  /* volca-exclude-start os */
  user: User;
  /* volca-exclude-end os */
}
