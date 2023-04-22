import joi, { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { container } from 'tsyringe';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';
import { User } from '../../entities';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);
  const user = container.resolve<User>('AuthenticatedUser');

  if (!user.hasActiveSubscription) {
    throw new ServiceError({
      name: ErrorNames.SUBSCRIPTION_REQUIRED,
      message: 'A subscription is required to create a project',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const { name } = ctx.request.body;

  const project = await projectService.create({ adminId: user.id, name });
  return {
    body: {
      project: project.toJSON(),
    },
  };
});
