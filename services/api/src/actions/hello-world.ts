import { useApiAction } from './utils/api-action';

export const helloWorldAction = useApiAction(async () => {
  return {
    body: {
      message: `Hello world!`,
    },
  };
});
