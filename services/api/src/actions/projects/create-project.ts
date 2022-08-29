import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);

  const { name } = ctx.request.body;

  const project = await projectService.create({ adminId: ctx.user.id, name });

  return {
    body: {
      project,
    },
  };
});
