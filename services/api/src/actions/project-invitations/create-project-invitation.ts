import { StatusCodes } from 'http-status-codes';
import { CustomContext } from '../../types';
import { useApiAction } from '../utils/api-action';
import { ServiceError } from '../../errors/service-error';
import { ErrorNames } from '../../constants';

export const action = useApiAction(async (ctx: CustomContext) => {
  const {
    user,
    params: { projectId },
    dependencies: {
      services: { projectService, projectInvitationService },
    },
  } = ctx;

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
