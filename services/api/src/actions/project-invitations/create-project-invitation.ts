import { StatusCodes } from 'http-status-codes';
import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { ProjectInvitationService, ProjectService } from '../../services';
import { User } from '../../entities';

type CreateProjectInvitation = {
  projectId: string;
};

export const schema: Schema = joi.object({
  projectId: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectInvitationService = container.resolve(ProjectInvitationService);
  const projectService = container.resolve(ProjectService);
  const user = container.resolve<User>('AuthenticatedUser');

  const { projectId } = <CreateProjectInvitation>ctx.request.body;

  const project = await projectService.get(projectId);

  if (!project) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'The project does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const projectInvitation = await projectInvitationService.create({
    fromUserId: user.id,
    projectId: project.id,
  });

  return {
    body: {
      projectInvitation: projectInvitation.toJSON(),
    },
  };
});
