import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';

export const schema: Schema = joi.object({
  id: joi.string().required(),
  name: joi.string().required(),
  admin_id: joi.string().optional(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  const { name, admin_id: adminId } = ctx.request.body;
  const { projectId: id } = ctx.params;

  const oldProject = await projectService.get(id);
  const project = await projectService.update({ ...oldProject, id, adminId, name });

  return {
    body: {
      project,
    },
  };
});
