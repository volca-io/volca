import joi, { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

type UpdateProjectBody = {
  name: string;
};

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    dependencies: {
      services: { projectService },
    },
    params: { projectId },
  } = ctx;

  const { name } = <UpdateProjectBody>ctx.request.body;

  const oldProject = await projectService.get(projectId);
  if (!oldProject) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'Could not find a project to update',
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const project = await projectService.update({ ...oldProject, name });

  return {
    body: {
      project: project?.toJSON(),
    },
  };
});
