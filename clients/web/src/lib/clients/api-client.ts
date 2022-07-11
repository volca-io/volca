import { Project, User } from '../../types';

const baseUrl = 'http://localhost:4000';

const postOptions = {
  method: 'POST',
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
  },
};

const putOptions = {
  method: 'PUT',
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
  },
};

const deleteOptions = {
  method: 'DELETE',
  mode: 'cors' as RequestMode,
};

export class ApiClient {
  static async getMe(): Promise<User> {
    return fetch(`${baseUrl}/me`)
      .then((response) => response.json())
      .then((response) => response.me);
  }

  static async getProjects(): Promise<Project[]> {
    return fetch(`${baseUrl}/projects`)
      .then((response) => response.json())
      .then((response) => response.projects);
  }

  static async createProject({ name }: { name: string }): Promise<Project> {
    return fetch(`${baseUrl}/projects`, {
      ...postOptions,
      body: JSON.stringify({ name }),
    }).then((response) => response.json());
  }

  static async getProject(id: string): Promise<Project> {
    return fetch(`${baseUrl}/projects/${id}`)
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
}
