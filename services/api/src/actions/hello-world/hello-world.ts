import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async () => {
  return {
    body: {
      message: 'Hello world!',
    },
  };
});
