import { injectable } from 'tsyringe';
import { Project, ProjectUser } from '../entities';

type CreateProjectInput = {
  adminId: string;
  name: string;
};

type UpdateProjectInput = {
  id: string;
  adminId: string;
  name: string;
};

@injectable()
export class ProjectService {
  public async get(id: string): Promise<Project | undefined> {
    return Project.query().findById(id).withGraphFetched('admin').withGraphFetched('users');
  }

  public async list(userId: string): Promise<Project[]> {
    const memberProjects = await ProjectUser.query().where({ userId });
    return Project.query()
      .whereIn(
        'projects.id',
        memberProjects.map((p) => p.projectId)
      )
      .withGraphFetched('admin')
      .withGraphFetched('users');
  }

  public async create({ adminId, name }: CreateProjectInput): Promise<Project> {
    const project = await Project.query().insert({ adminId, name }).withGraphFetched('admin').returning('*');
    await ProjectUser.query().insert({ userId: adminId, projectId: project.id });
    return project;
  }

  public async update({ id, adminId, name }: UpdateProjectInput): Promise<Project | undefined> {
    return Project.query()
      .where({ id })
      .update({ adminId, name })
      .returning('*')
      .withGraphFetched('admin')
      .withGraphFetched('users')
      .first();
  }

  public async delete(id: string): Promise<void> {
    await Project.query().deleteById(id);
  }
}
