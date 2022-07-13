import joi, { Schema } from 'joi';
import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { ProjectService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { name } = ctx.request.body;

  const project = await projectService.create({ adminId: ctx.user.id, name });

  return {
    body: {
      project,
    },
  };
});
