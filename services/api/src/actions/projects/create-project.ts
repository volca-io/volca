import joi, { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';

import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

type CreateProjectBody = {
  name: string;
};

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    dependencies: {
      services: { projectService },
    },
  } = ctx;

  if (!user.hasActiveSubscription) {
    throw new ServiceError({
      name: ErrorNames.SUBSCRIPTION_REQUIRED,
      message: 'A subscription is required to create a project',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const { name } = <CreateProjectBody>ctx.request.body;

  const project = await projectService.create({ ownerId: user.id, name });

  return {
    body: {
      project: project.toJSON(),
    },
  };
});
