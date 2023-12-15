import { StatusCodes } from 'http-status-codes';
import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { Role } from '../../services';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

type UpdateProjectUserBody = {
  role: Role;
};

export const schema: Schema = joi.object({
  role: joi
    .string()
    .valid(...Object.keys(Role))
    .required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { projectUserService },
    },
    params: { projectId, userId },
    request: { body },
  } = ctx;

  const { role } = <UpdateProjectUserBody>body;

  const projectUser = await projectUserService.get(userId, projectId);

  if (!projectUser) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_INVITATION_INVALID,
      message: 'The user does not belong to the project',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  await projectUserService.update({ id: projectUser.id, role });

  return {
    body: {},
  };
});
