import { Project } from '../entities';

export interface ProjectService {
  list(): Promise<Project[]>;
}
