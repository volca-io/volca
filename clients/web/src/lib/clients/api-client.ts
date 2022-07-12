import { Project, ProjectInvitation, User } from '../../types';

const baseUrl = 'http://127.0.0.1:4000';

const getOptions = {
  method: 'GET',
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' as RequestCredentials,
};

const postOptions = {
  method: 'POST',
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include' as RequestCredentials,
};

const putOptions = {
  method: 'PUT',
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
};

const deleteOptions = {
  method: 'DELETE',
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
};

export class ApiClient {
  static async authnPassword(email: string, password: string): Promise<Response> {
    return fetch(`${baseUrl}/authn/password`, {
      ...postOptions,
      body: JSON.stringify({ email, password }),
    });
  }

  static async signOut(): Promise<Response> {
    return fetch(`${baseUrl}/authn/sign-out`, {
      ...postOptions,
    });
  }

  static async getMe(): Promise<User> {
    return fetch(`${baseUrl}/me`, getOptions)
      .then((response) => response.json())
      .then((response) => response.me);
  }

  static async getProjects(): Promise<Project[]> {
    return fetch(`${baseUrl}/projects`, getOptions)
      .then((response) => response.json())
      .then((response) => response.projects);
  }

  static async createProject({ name }: { name: string }): Promise<Project> {
    const { project } = await fetch(`${baseUrl}/projects`, {
      ...postOptions,
      body: JSON.stringify({ name }),
    }).then((response) => response.json());

    return project;
  }

  static async getProject(id: string): Promise<Project> {
    return fetch(`${baseUrl}/projects/${id}`, getOptions)
      .then((response) => response.json())
      .then((response) => response.project);
  }

  static async updateProject({ id, name }: { id: string; name: string }): Promise<Project> {
    return fetch(`${baseUrl}/projects/${id}`, {
      ...putOptions,
      body: JSON.stringify({ name }),
    })
      .then((response) => response.json())
      .then((response) => response.project);
  }

  static async deleteProject(id: string): Promise<Project> {
    return fetch(`${baseUrl}/projects/${id}`, {
      ...deleteOptions,
    })
      .then((response) => response.json())
      .then((response) => response);
  }

  static async getProjectUsers(id: string): Promise<User[]> {
    return fetch(`${baseUrl}/projects/users/${id}`, getOptions)
      .then((response) => response.json())
      .then((response) => response.users);
  }

  static async createProjectInvitation({
    projectId,
    toUserEmail,
  }: {
    projectId: string;
    toUserEmail: string;
  }): Promise<ProjectInvitation> {
    return fetch(`${baseUrl}/project-invitations`, {
      ...postOptions,
      body: JSON.stringify({ projectId, toUserEmail }),
    })
      .then((response) => response.json())
      .then((response) => response.project_invitation);
  }

  static async acceptProjectInvitation({ key }: { key: string }): Promise<void> {
    await fetch(`${baseUrl}/project-invitations/${key}`, {
      ...getOptions,
    });
  }
}
