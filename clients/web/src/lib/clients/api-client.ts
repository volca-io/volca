import { Project, User } from '../../types';

const baseUrl = 'http://localhost:4000';

const postOptions = {
  method: 'POST',
  mode: 'cors' as RequestMode,
  headers: {
    'Content-Type': 'application/json',
  },
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
}
