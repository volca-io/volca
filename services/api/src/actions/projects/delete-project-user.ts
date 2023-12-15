import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { userService, projectUserService },
    },
    params: { projectId, userId },
  } = ctx;

  const toUser = await userService.findById(userId);

  if (!toUser) {
    throw new ServiceError({
      name: ErrorNames.USER_DOES_NOT_EXIST,
      message: 'The user does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  await projectUserService.delete(projectId, userId);
});
