import { StatusCodes } from 'http-status-codes';
import joi, { Schema } from 'joi';
import { CustomContext } from '../../types';
import { container } from 'tsyringe';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';
import { ProjectInvitationService, ProjectService, UserService } from '../../services';
import { User } from '../../entities';

export const schema: Schema = joi.object({
  to_user_email: joi.string().required(),
  project_id: joi.string().required(),
});

export const action = useApiAction(async (ctx: CustomContext) => {
  const projectInvitationService = container.resolve(ProjectInvitationService);
  const userService = container.resolve(UserService);
  const projectService = container.resolve(ProjectService);
  const user = container.resolve<User>('AuthenticatedUser');

  const { toUserEmail, projectId } = ctx.request.body;

  const project = await projectService.get(projectId);

  if (!project) {
    throw new ServiceError({
      name: ErrorNames.PROJECT_DOES_NOT_EXIST,
      message: 'The project does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  if (project.adminId !== user.id) {
    throw new ServiceError({
      name: ErrorNames.AUTHORIZATION_FAILED,
      message: 'The user is not authorized for this project',
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }

  const toUser = await userService.findByEmail(toUserEmail);

  if (!toUser) {
    throw new ServiceError({
      name: ErrorNames.USER_DOES_NOT_EXIST,
      message: 'The user does not exist',
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const projectInvitation = await projectInvitationService.create({
    fromUserId: user.id,
    toUserId: toUser.id,
    projectId: project.id,
  });

  return {
    body: {
      projectInvitation: projectInvitation.toJSON(),
    },
  };
});
