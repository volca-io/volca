import { RouterContext } from '@koa/router';
import { HelloWorldService } from './services';

export interface CustomContext extends RouterContext {
  services: {
    helloWorldService: HelloWorldService;
  };
}
