import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { StatusCodes } from 'http-status-codes';

export const schema: Schema = joi.object({
  name: joi.string().required(),
  admin_id: joi.string().optional(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  const { name, adminId } = ctx.request.body;
  const { projectId: id } = ctx.params;

  const oldProject = await projectService.get(id);
  if (!oldProject) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'Could not find a project to update',
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const project = await projectService.update({ ...oldProject, adminId, name });

  return {
    body: {
      project: project?.toJSON(),
    },
  };
});
