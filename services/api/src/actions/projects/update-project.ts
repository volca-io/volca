import joi, { Schema } from 'joi';
import { CustomContext, DI_TYPES } from '../../types';
import { container } from '../../inversify.config';
import { ProjectService } from '../../interfaces';
import { useApiAction } from '../utils/api-action';

export const schema: Schema = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  adminId: joi.string().optional(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.get<ProjectService>(DI_TYPES.ProjectService);

  const { name, adminId } = ctx.request.body;
  const { id } = ctx.params;

  const oldProject = await projectService.get(id);
  const project = await projectService.update({ ...oldProject, id, adminId, name });

  return {
    body: {
      project,
    },
  };
});
