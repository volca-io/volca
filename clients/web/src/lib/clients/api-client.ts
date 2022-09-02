import ky, { HTTPError } from 'ky';
import jwt_decode from 'jwt-decode';
import { Project, ProjectInvitation, User, StripeSession } from '../../types';

type AccessToken = {
  exp: number;
  sub: string;
};

type GetMeResponse = {
  me: User;
};

type GetProjectResponse = {
  project: Project;
};

type CreateProjectResponse = {
  project: Project;
};

type UpdateProjectResponse = {
  project: Project;
};

type GetProjectUsersResponse = {
  users: User[];
};

type CreateProjectInvitationResponse = {
  project_invitation: ProjectInvitation;
};

type AcceptProjectInvitationResponse = {
  accepted: boolean;
};

type ApiErrorInterface = {
  name: string;
  message: string;
  status: number;
};

type CreateStripeSessionResponse = {
  stripe_session: StripeSession;
};

type CreateStripeBillingPortalSessionResponse = {
  stripe_billing_portal_session: StripeSession;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

export class ApiError extends Error implements ApiErrorInterface {
  public name: string;
  public status: number;

  constructor({ name, message, status }: { name: string; message: string; status: number }) {
    super(message);
    this.name = name;
    this.status = status;
  }
}

export class ApiClient {
  private static prefixUrl = process.env.REACT_APP_API_URL;

  static client = ky.create({
    prefixUrl: this.prefixUrl,
    credentials: 'include',
    mode: 'cors',
  });

  static tokenClient = ApiClient.client.extend({
    hooks: {
      beforeRequest: [
        async (request) => {
          let token = localStorage.getItem('access-token');
          if (token && this.accessTokenIsAboutToExpire()) {
            token = await this.refreshToken();
          }
          request.headers.set('authorization', `Bearer ${token}`);
        },
      ],
    },
  });

  private static async refreshToken(): Promise<string> {
    const { access_token } = await this.client.post('authn/refresh').json<TokenResponse>();
    localStorage.setItem('access-token', access_token);
    return access_token;
  }

  private static accessTokenIsAboutToExpire() {
    const accessToken = localStorage.getItem('access-token');

    if (!accessToken) {
      return true;
    }

    const decoded = jwt_decode<AccessToken>(accessToken);
    const expires = new Date(decoded.exp);

    return expires.getTime() * 1000 + 10000 < new Date().getTime();
  }

  private static isCustomApiError(error: Record<string, unknown>) {
    return ['name', 'message'].every((item) => error.hasOwnProperty(item));
  }

  private static async handleApiError<T>(action: Promise<T>): Promise<T> {
    try {
      const res = await action;
      return res;
    } catch (err: unknown) {
      if (err instanceof HTTPError) {
        const body = await err.response.json();
        if (body && this.isCustomApiError(body)) {
          throw new ApiError({ name: body.name, message: body.message, status: err.response.status });
        }
      }

      throw new ApiError({
        name: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred, please try again later',
        status: 500,
      });
    }
  }

  static async register(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    const { access_token } = await this.handleApiError(
      this.client.post('authn/register', { json: { firstName, lastName, email, password } }).json<TokenResponse>()
    );

    localStorage.setItem('access-token', access_token);
  }

  static async authnPassword(email: string, password: string): Promise<void> {
    const { access_token } = await this.handleApiError(
      this.client.post('authn/password', { json: { email, password } }).json<TokenResponse>()
    );

    localStorage.setItem('access-token', access_token);
  }

  static async signOut(): Promise<void> {
    await this.handleApiError(this.client.post('authn/sign-out'));
  }

  static async getMe(): Promise<User> {
    const { me } = await this.handleApiError(this.tokenClient.get('me').json<GetMeResponse>());
    return me;
  }

  static async getProjects(): Promise<Project[]> {
    const { projects } = await this.handleApiError(this.tokenClient.get('projects').json());
    return projects;
  }

  static async createProject({ name }: { name: string }): Promise<Project> {
    const { project } = await this.handleApiError(
      this.tokenClient.post('projects', { json: { name } }).json<CreateProjectResponse>()
    );
    return project;
  }

  static async getProject(id: string): Promise<Project> {
    const { project } = await this.handleApiError(this.tokenClient.get(`projects/${id}`).json<GetProjectResponse>());
    return project;
  }

  static async updateProject({ id, name }: Partial<Project>): Promise<Project> {
    const { project } = await this.handleApiError(
      this.tokenClient.put(`projects/${id}`, { json: { id, name } }).json<UpdateProjectResponse>()
    );
    return project;
  }

  static async deleteProject(id: string): Promise<void> {
    await this.tokenClient.delete(`projects/${id}`);
  }

  static async getProjectUsers(id: string): Promise<User[]> {
    const { users } = await this.handleApiError(
      this.tokenClient.get(`projects/users/${id}`).json<GetProjectUsersResponse>()
    ); // TODO - Change url structure to have id after projects
    return users;
  }

  static async createProjectInvitation({
    projectId,
    toUserEmail,
  }: {
    projectId: string;
    toUserEmail: string;
  }): Promise<ProjectInvitation> {
    const { project_invitation } = await this.handleApiError(
      this.tokenClient
        .post('project-invitations', { json: { projectId, toUserEmail } })
        .json<CreateProjectInvitationResponse>()
    );
    return project_invitation;
  }

  static async acceptProjectInvitation({ key }: { key: string }): Promise<AcceptProjectInvitationResponse> {
    return this.handleApiError(this.tokenClient.get(`project-invitations/${key}`).json());
  }

  static async createStripeSession(): Promise<StripeSession> {
    const { stripe_session } = await this.handleApiError(
      this.tokenClient.post('stripe/sessions').json<CreateStripeSessionResponse>()
    );

    return stripe_session;
  }

  static async createStripeBillingPortalSession(): Promise<StripeSession> {
    const { stripe_billing_portal_session } = await this.handleApiError(
      this.tokenClient.post('stripe/billing-portal-sessions').json<CreateStripeBillingPortalSessionResponse>()
    );

    return stripe_billing_portal_session;
  }
}
