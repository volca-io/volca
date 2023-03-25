import { container } from 'tsyringe';
import { User } from '../../entities';
import { Security } from '../../lib/security/security';

import { CommunicationsService } from '../../services/communications-service';
import { useApiAction } from '../utils/api-action';

export const action = useApiAction(async () => {
  const { email, firstName } = container.resolve<User>('AuthenticatedUser');
  const security = container.resolve(Security);
  const comsService = container.resolve(CommunicationsService);

  const token = security.createToken({ payload: { sub: email }, expiresIn: 60 * 60 * 24 });

  await comsService.sendVerificationEmail({ email, firstName, token });
});
