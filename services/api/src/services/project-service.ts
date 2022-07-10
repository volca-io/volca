import { injectable } from 'inversify';
import { ProjectService as ProjectServiceInterface, CreateProjectInput, UpdateProjectInput } from '../interfaces';
import { Project } from '../entities';

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public async get(id: string): Promise<Project | undefined> {
    return Project.query().findById(id);
  }

  public async list(adminId: string): Promise<Project[]> {
    return Project.query().where({ admin_id: adminId });
  }

  public async create({ adminId, name }: CreateProjectInput): Promise<Project> {
    return Project.query().insert({ admin_id: adminId, name });
  }

  public async update({ id, adminId, name }: UpdateProjectInput): Promise<Project | undefined> {
    await Project.query().where({ id }).update({ admin_id: adminId, name });
    return Project.query().findById(id);
  }
}
