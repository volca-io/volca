import Koa from 'koa';
import { CustomContext } from '../types';
import correlator from 'correlation-id';

export const correlationIdMiddleware = async (ctx: CustomContext, next: Koa.Next) => {
  correlator.withId(async () => {
    ctx.correlationId = correlator.getId() || 'no-id';
    await next();
  });
};
