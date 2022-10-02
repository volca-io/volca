import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState, useResetRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { currentUserState, projectsState, selectedProjectState } from '../state';
import { User } from '../types';
import { useApiActions } from './api-actions';

export const useUserActions = () => {
  const setUser = useSetRecoilState(currentUserState);
  const resetProjects = useResetRecoilState(projectsState);
  const resetSelectedProject = useResetRecoilState(selectedProjectState);
  const navigate = useNavigate();
  const location = useLocation();
  const { executeApiAction } = useApiActions();

  const getMe = () =>
    executeApiAction<User>({
      action: async () => {
        const { me } = await ApiClient.getMe();
        return me;
      },
    });

  const register = async (firstName: string, lastName: string, email: string, password: string) =>
    executeApiAction<{ me: User }>({
      action: async () => ApiClient.register(firstName, lastName, email, password),
      onSuccess: async ({ access_token }: { access_token: string }) => {
        localStorage.setItem('access_token', access_token);
        const continueUrl = new URLSearchParams(location.search).get('continue') || '/';
        navigate(continueUrl);
        const user = await getMe();
        if (user) setUser(user);
      },
    });

  const authnPassword = (email: string, password: string, remember: boolean) =>
    executeApiAction({
      action: () => ApiClient.authnPassword(email, password),
      onSuccess: async (response: { access_token: string }) => {
        const { access_token } = response;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('remember_toggled', remember ? 'true' : 'false');
        if (remember) {
          localStorage.setItem('remembered_user_identifier', email);
        } else {
          localStorage.removeItem('remembered_user_identifier');
        }
        const user = await getMe();
        if (user) setUser(user);
      },
      errorMessage: 'Wrong user name or password',
    });

  const resetPassword = (email: string) =>
    executeApiAction({
      action: () => ApiClient.resetPassword(email),
      successMessage:
        'Your request was successful. If there is an account connected to this email, you will soon get an email with instructions on how to reset your password.',
      errorMessage: 'Something went wrong when processing your request. Please try again later.',
    });

  const verifyResetPassword = (password: string, resetToken: string) =>
    executeApiAction({
      action: () => ApiClient.verifyResetPassword(password, resetToken),
      successMessage: 'Your password was successfully set.',
      errorMessage: 'Your reset link is invalid. Request a new one on the reset password page.',
    });

  const signOut = () =>
    executeApiAction({
      action: () => ApiClient.signOut(),
      onSuccess: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('selected_project_id');
        setUser(null);
        resetProjects();
        resetSelectedProject();
        navigate('/sign-in');
      },
    });

  const getRememberInfo = (): { identifier: string | undefined; remember: boolean | undefined } => {
    const identifier = localStorage.getItem('remembered_user_identifier') || undefined;
    const rememberToggled = localStorage.getItem('remember_toggled');

    const remember = rememberToggled ? rememberToggled === 'true' : undefined;
    return { remember, identifier };
  };

  return { register, authnPassword, signOut, getRememberInfo, resetPassword, verifyResetPassword, getMe };
};
