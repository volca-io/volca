import { Project } from '../entities';

export type CreateProjectInput = {
  adminId: string;
  name: string;
};

export type UpdateProjectInput = {
  id: string;
  adminId: string;
  name: string;
};

export interface ProjectService {
  get(id: string): Promise<Project | undefined>;
  list(adminId: string): Promise<Project[]>;
  create(input: CreateProjectInput): Promise<Project>;
  update(input: UpdateProjectInput): Promise<Project | undefined>;
  delete(id: string): Promise<void>;
}
