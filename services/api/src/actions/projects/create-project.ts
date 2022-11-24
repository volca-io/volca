import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ProjectService } from '../../services';
import { User } from '../../entities';

export const schema: Schema = joi.object({
  name: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectService = container.resolve(ProjectService);
  const user = container.resolve<User>('AuthenticatedUser');

  const { name } = ctx.request.body;

  const project = await projectService.create({ adminId: user.id, name });
  return {
    body: {
      project,
    },
  };
});
