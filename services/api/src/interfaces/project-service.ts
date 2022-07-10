import { Project } from '../entities';

export type CreateProjectInput = {
  adminId: string;
  name: string;
};

export interface ProjectService {
  list(adminId: string): Promise<Project[]>;
  create(input: CreateProjectInput): Promise<Project>;
}
