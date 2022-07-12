import { useRecoilState } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { currentUser } from '../state';

export const useUserActions = () => {
  const [, setUser] = useRecoilState(currentUser);

  const signIn = async (email: string, password: string): Promise<void> => {
    const authResponse = await ApiClient.authnPassword(email, password);

    if (authResponse.status === 200) {
      const user = await ApiClient.getMe();
      setUser(user);
    } else {
      throw new Error('Authentication failed');
    }
  };

  const signOut = async () => {
    const resp = await ApiClient.signOut();
    if (resp.status !== 200) {
      throw new Error('Failed to sign out');
    }
  };

  return { signIn, signOut };
};
