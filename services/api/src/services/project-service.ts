import { injectable } from 'inversify';
import { ProjectService as ProjectServiceInterface } from '../interfaces';
import { Project } from '../entities';

@injectable()
export class ProjectService implements ProjectServiceInterface {
  public async list(): Promise<Project[]> {
    return Project.query().whereNotNull('id'); // TODO: Get projects for the current user
  }
}
