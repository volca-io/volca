import { container } from 'tsyringe';
import { User } from '../../entities';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async () => {
  const user = container.resolve<User>('AuthenticatedUser');
  return {
    body: {
      me: user,
    },
  };
});
