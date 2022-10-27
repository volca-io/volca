import { container } from 'tsyringe';
import { User } from '../../entities';

import { CommunicationsService } from '../../services/communications-service';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async () => {
  const { email, firstName } = container.resolve<User>('AuthenticatedUser');

  const comsService = container.resolve(CommunicationsService);
  await comsService.sendVerificationEmail({ email, firstName });
});
