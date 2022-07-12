import { Project, User } from '../../types';

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
    return fetch(`${baseUrl}/projects`, {
      ...postOptions,
      body: JSON.stringify({ name }),
    }).then((response) => response.json());
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
}
