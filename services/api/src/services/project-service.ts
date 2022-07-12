import { injectable } from 'inversify';
import { ProjectService as ProjectServiceInterface, CreateProjectInput, UpdateProjectInput } from '../interfaces';
import { Project, ProjectUser } from '../entities';

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public async get(id: string): Promise<Project | undefined> {
    return Project.query().findById(id);
  }

  public async list(userId: string): Promise<Project[]> {
    const memberProjects = await ProjectUser.query().where({ userId });
    return Project.query().whereIn(
      'id',
      memberProjects.map((p) => p.projectId)
    );
  }

  public async create({ adminId, name }: CreateProjectInput): Promise<Project> {
    const project = await Project.query().insert({ adminId, name });
    await ProjectUser.query().insert({ userId: adminId, projectId: project.id });
    return project;
  }

  public async update({ id, adminId, name }: UpdateProjectInput): Promise<Project | undefined> {
    await Project.query().where({ id }).update({ adminId, name });
    return Project.query().findById(id);
  }

  public async delete(id: string): Promise<void> {
    await Project.query().deleteById(id);
  }
}
