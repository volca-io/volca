import { CustomContext } from '../types';

export const helloWorldAction = (ctx: CustomContext) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = JSON.stringify({
    message: 'Hello world!!',
  });
};
