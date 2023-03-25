import ky, { HTTPError } from 'ky';
import jwt_decode from 'jwt-decode';
import { Project, ProjectInvitation, User, StripeSession, Plan } from '../../types';

export type AccessToken = {
  exp: number;
  sub: string;
};

type GetMeResponse = {
  me: User;
};

type ListProjectsResponse = {
  projects: Project[];
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

type StripePlansReponse = {
  plans: Plan[];
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
};

export class ApiError extends Error implements ApiErrorInterface {
  public readonly name: string;
  public readonly status: number;

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
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            const token = this.tokenNeedsRefresh(accessToken) ? await this.refreshToken() : accessToken;
            request.headers.set('authorization', `Bearer ${token}`);
          } else {
            return new Response();
          }
        },
      ],
    },
  });

  private static async refreshToken(): Promise<string> {
    const { access_token } = await this.client.post('authn/refresh').json<TokenResponse>();
    return access_token;
  }

  private static tokenNeedsRefresh(accessToken: string | null) {
    if (!accessToken) {
      return true;
    }

    const decoded = jwt_decode<AccessToken>(accessToken);
    const expires = new Date(decoded.exp);

    const isAboutToExpire = expires.getTime() * 1000 + 10000 < new Date().getTime();
    return isAboutToExpire;
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

  static async register(firstName: string, lastName: string, email: string, password: string): Promise<TokenResponse> {
    return this.handleApiError(
      this.client
        .post('authn/register', { json: { first_name: firstName, last_name: lastName, email, password } })
        .json<TokenResponse>()
    );
  }

  static async authnPassword(email: string, password: string): Promise<TokenResponse> {
    return this.handleApiError(this.client.post('authn/password', { json: { email, password } }).json<TokenResponse>());
  }

  static async resetPassword(email: string): Promise<void> {
    await this.handleApiError(this.client.post('authn/reset-password', { json: { email } }));
  }

  static async verifyResetPassword(password: string, resetToken: string): Promise<void> {
    await this.handleApiError(
      this.client.post('authn/reset-password/verify', { json: { password, reset_token: resetToken } })
    );
  }

  static async verifyUser(verifyToken: string): Promise<void> {
    await this.handleApiError(this.client.post('authn/verify-user', { json: { verify_token: verifyToken } }));
  }

  static async resendVerification(): Promise<void> {
    await this.handleApiError(this.tokenClient.post('authn/resend-verification'));
  }

  static async signOut(): Promise<void> {
    await this.handleApiError(this.client.post('authn/sign-out'));
  }

  static async getMe(): Promise<GetMeResponse> {
    return this.handleApiError(this.tokenClient.get('me').json<GetMeResponse>());
  }

  static async getProjects(): Promise<Project[]> {
    const { projects } = await this.handleApiError(this.tokenClient.get('projects').json<ListProjectsResponse>());
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
      this.tokenClient.put(`projects/${id}`, { json: { name } }).json<UpdateProjectResponse>()
    );
    return project;
  }

  static async deleteProject(id: string): Promise<void> {
    await this.tokenClient.delete(`projects/${id}`);
  }

  static async getProjectUsers(id: string): Promise<User[]> {
    const { users } = await this.handleApiError(
      this.tokenClient.get(`projects/${id}/users`).json<GetProjectUsersResponse>()
    );
    return users;
  }

  static async deleteProjectUser(projectId: string, userId: string): Promise<void> {
    await this.tokenClient.delete(`projects/${projectId}/users/${userId}`);
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
        .post('project-invitations', { json: { project_id: projectId, to_user_email: toUserEmail } })
        .json<CreateProjectInvitationResponse>()
    );
    return project_invitation;
  }

  static async acceptProjectInvitation({ key }: { key: string }): Promise<AcceptProjectInvitationResponse> {
    return this.handleApiError(this.tokenClient.get(`project-invitations/${key}`).json());
  }

  static async createStripeSession({ planId }: { planId: string }): Promise<StripeSession> {
    const { stripe_session } = await this.handleApiError(
      this.tokenClient.post('stripe/sessions', { json: { plan_id: planId } }).json<CreateStripeSessionResponse>()
    );

    return stripe_session;
  }

  static async createStripeBillingPortalSession(): Promise<StripeSession> {
    const { stripe_billing_portal_session } = await this.handleApiError(
      this.tokenClient.post('stripe/billing-portal-sessions').json<CreateStripeBillingPortalSessionResponse>()
    );

    return stripe_billing_portal_session;
  }

  static async listStripePlans(): Promise<Plan[]> {
    const { plans } = await this.handleApiError(this.tokenClient.get('stripe/plans').json<StripePlansReponse>());

    return plans;
  }

  static async sendSupportMessage(message: string): Promise<void> {
    await this.handleApiError(this.tokenClient.post('communications/support', { json: { message } }));
  }
}
