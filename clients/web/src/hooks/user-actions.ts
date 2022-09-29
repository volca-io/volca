import { useRecoilState, useResetRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { currentUser, projects as projectsState, selectedProject as selectedProjectState } from '../state';
import { useApiActions } from './api-actions';

export const useUserActions = () => {
  const [, setUser] = useRecoilState(currentUser);
  const resetProjects = useResetRecoilState(projectsState);
  const resetSelectedProject = useResetRecoilState(selectedProjectState);
  const { executeApiCall, executeApiAction } = useApiActions();

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    const { me } = await executeApiCall({
      action: async () => {
        const { access_token } = await ApiClient.register(firstName, lastName, email, password);
        localStorage.setItem('access-token', access_token);

        return ApiClient.getMe();
      },
    });

    setUser(me);
  };

  const authnPassword = async (email: string, password: string, remember: boolean): Promise<void> => {
    const { me } = await executeApiCall({
      action: async () => {
        const { access_token } = await ApiClient.authnPassword(email, password);
        localStorage.setItem('access-token', access_token);

        return ApiClient.getMe();
      },
    });

    setUser(me);
    localStorage.setItem('remember_toggled', remember ? 'true' : 'false');

    if (remember) {
      localStorage.setItem('remembered_user_identifier', email);
    } else {
      localStorage.removeItem('remembered_user_identifier');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    await executeApiCall({
      action: () => ApiClient.resetPassword(email),
    });
  };

  const verifyResetPassword = async (password: string, resetToken: string): Promise<void> => {
    await executeApiCall({
      action: () => ApiClient.verifyResetPassword(password, resetToken),
    });
  };

  const clearUserState = async () => {
    setUser(null);
    resetProjects();
    resetSelectedProject();
  };

  const signOut = () =>
    executeApiAction({
      action: () => ApiClient.signOut(),
      onSuccess: () => {
        clearUserState();
        localStorage.removeItem('access-token');
      },
    });

  const getRememberInfo = (): { identifier: string | undefined; remember: boolean | undefined } => {
    const identifier = localStorage.getItem('remembered_user_identifier') || undefined;
    const rememberToggled = localStorage.getItem('remember_toggled');

    const remember = rememberToggled ? rememberToggled === 'true' : undefined;
    return { remember, identifier };
  };

  return { register, authnPassword, signOut, getRememberInfo, resetPassword, verifyResetPassword, clearUserState };
};
