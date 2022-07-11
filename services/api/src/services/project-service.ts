import { injectable } from 'inversify';
import { ProjectService as ProjectServiceInterface, CreateProjectInput, UpdateProjectInput } from '../interfaces';
import { Project, ProjectUser } from '../entities';

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public async get(id: string): Promise<Project | undefined> {
    return Project.query().findById(id);
  }

  public async list(adminId: string): Promise<Project[]> {
    const memberProjects = await ProjectUser.query().where({ userId: adminId });
    return Project.query()
      .where({ adminId })
      .orWhereIn(
        'id',
        memberProjects.map((p) => p.projectId)
      );
  }

  public async create({ adminId, name }: CreateProjectInput): Promise<Project> {
    return Project.query().insert({ adminId, name });
  }

  public async update({ id, adminId, name }: UpdateProjectInput): Promise<Project | undefined> {
    await Project.query().where({ id }).update({ adminId, name });
    return Project.query().findById(id);
  }

  public async delete(id: string): Promise<void> {
    await Project.query().deleteById(id);
  }
}
