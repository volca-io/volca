import { StatusCodes } from 'http-status-codes';
import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectRoleId, ProjectUserService } from '../../services';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const schema: Schema = joi.object({
  role: joi
    .string()
    .valid(...Object.keys(ProjectRoleId))
    .optional(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectUserService = container.resolve(ProjectUserService);

  const { role } = ctx.request.body;
  const { projectId, userId } = ctx.params;

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
