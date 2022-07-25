import { useRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { currentUser } from '../state';

export const useUserActions = () => {
  const [, setUser] = useRecoilState(currentUser);

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    await ApiClient.register(firstName, lastName, email, password);
    const user = await ApiClient.getMe();
    setUser(user);
  };

  const signIn = async (email: string, password: string, remember: boolean): Promise<void> => {
    const { access_token } = await ApiClient.authnPassword(email, password);

    localStorage.setItem('access-token', access_token);

    const user = await ApiClient.getMe();
    setUser(user);

    if (remember) {
      localStorage.setItem('remembered_user_identifier', email);
    } else {
      localStorage.removeItem('remembered_user_identifier');
    }

    localStorage.setItem('remember_toggled', remember ? 'true' : 'false');
  };

  const signOut = async () => {
    await ApiClient.signOut();
    localStorage.removeItem('access-token');
  };

  const getRememberInfo = (): { identifier: string | undefined; remember: boolean | undefined } => {
    const identifier = localStorage.getItem('remembered_user_identifier') || undefined;

    const rememberToggled = localStorage.getItem('remember_toggled');
    const remember = rememberToggled ? rememberToggled === 'true' : undefined;

    return { remember, identifier };
  };

  return { register, signIn, signOut, getRememberInfo };
};
