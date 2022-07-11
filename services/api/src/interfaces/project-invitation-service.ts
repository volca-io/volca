import { ProjectInvitation } from '../entities';

export type CreateProjectInvitationInput = {
  projectId: string;
  toUserId: string;
  fromUserId: string;
};

export interface ProjectInvitationService {
  get(id: string): Promise<ProjectInvitation | undefined>;
  findByKey(key: string): Promise<ProjectInvitation | undefined>;
  create(input: CreateProjectInvitationInput): Promise<ProjectInvitation>;
}
