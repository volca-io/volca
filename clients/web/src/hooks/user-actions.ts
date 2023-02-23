import { useLocation, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { currentUserState, projectsState, selectedProjectSelector } from '../state';
import { User } from '../types';
import { useApiActions } from './api-actions';

export const useUserActions = () => {
  const setUser = useSetRecoilState(currentUserState);
  const setProjects = useSetRecoilState(projectsState);
  const setSelectedProject = useSetRecoilState(selectedProjectSelector);
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
      errorMessage: 'Failed to register user',
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

  const verifyUser = (verifyToken: string) =>
    executeApiAction({
      action: () => ApiClient.verifyUser(verifyToken),
      onSuccess: async () => {
        const user = await getMe();
        if (user) setUser(user);
        navigate('/');
      },
      successMessage: 'Your user was successfully verified',
      errorMessage: 'Failed to verify user',
      errorMessageDuration: null,
    });

  const resendVerification = () =>
    executeApiAction({
      action: () => ApiClient.resendVerification(),
      successMessage: 'Verification re-sent',
      errorMessage: 'Failed to re-send verification',
    });

  const signOut = () =>
    executeApiAction({
      action: () => ApiClient.signOut(),
      onSuccess: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('selected_project_id');
        setUser(null);
        setProjects([]);
        setSelectedProject(null);
        navigate('/sign-in');
      },
    });

  const getRememberInfo = (): { identifier: string | undefined; remember: boolean | undefined } => {
    const identifier = localStorage.getItem('remembered_user_identifier') || undefined;
    const rememberToggled = localStorage.getItem('remember_toggled');

    const remember = rememberToggled ? rememberToggled === 'true' : undefined;
    return { remember, identifier };
  };

  const sendSupportMessage = (message: string) =>
    executeApiAction({
      action: () => ApiClient.sendSupportMessage(message),
      successMessage: 'Thank you for your message!',
      errorMessage: 'Failed to send message',
    });

  return {
    register,
    authnPassword,
    signOut,
    getRememberInfo,
    resetPassword,
    verifyResetPassword,
    verifyUser,
    resendVerification,
    getMe,
    sendSupportMessage,
  };
};
