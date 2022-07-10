import { injectable } from 'inversify';
import { ProjectService as ProjectServiceInterface, CreateProjectInput } from '../interfaces';
import { Project } from '../entities';

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public async list(adminId: string): Promise<Project[]> {
    return Project.query().where({ admin_id: adminId });
  }

  public async create({ adminId, name }: CreateProjectInput): Promise<Project> {
    return Project.query().insert({ admin_id: adminId, name });
  }
}
