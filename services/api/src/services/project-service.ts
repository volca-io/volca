import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';

import { Project, ProjectUser } from '../entities';
import { ServiceError } from '../errors/service-error';
import { ErrorNames } from '../constants';

type CreateProjectInput = {
  ownerId: string;
  name: string;
};

type UpdateProjectInput = {
  id: string;
  ownerId: string;
  name: string;
};

export enum ProjectRoleId {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

type ProjectRole = {
  id: ProjectRoleId;
};

@injectable()
export class ProjectService {
  public async get(id: string): Promise<Project | undefined> {
    return Project.query().findById(id).withGraphFetched('owner').withGraphFetched('users');
  }

  public async list(userId: string): Promise<Project[]> {
    const memberProjects = await ProjectUser.query().where({ userId });
    return Project.query()
      .whereIn(
        'projects.id',
        memberProjects.map((p) => p.projectId)
      )
      .withGraphFetched('owner')
      .withGraphFetched('users');
  }

  public async create({ ownerId, name }: CreateProjectInput): Promise<Project> {
    const project = await Project.query().insert({ ownerId, name }).returning('id');
    await ProjectUser.query().insert({ userId: ownerId, projectId: project.id, role: ProjectRoleId.OWNER });
    const projectWithUsers = await Project.query()
      .findById(project.id)
      .withGraphFetched('owner')
      .withGraphFetched('users');

    if (!projectWithUsers) {
      throw new ServiceError({
        name: ErrorNames.INTERNAL_SERVER_ERROR,
        message: 'Failed to create project',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
    return projectWithUsers;
  }

  public async update({ id, ownerId, name }: UpdateProjectInput): Promise<Project | undefined> {
    return Project.query()
      .where({ id })
      .update({ ownerId, name })
      .returning('*')
      .withGraphFetched('owner')
      .withGraphFetched('users')
      .first();
  }

  public async delete(id: string): Promise<void> {
    await Project.query().deleteById(id);
  }

  public listRoles(): ProjectRole[] {
    return Object.keys(ProjectRoleId).map((id) => ({
      id: id as ProjectRoleId,
    }));
  }
}
