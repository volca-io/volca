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

  const signIn = async (email: string, password: string): Promise<void> => {
    await ApiClient.authnPassword(email, password);
    const user = await ApiClient.getMe();
    setUser(user);
  };

  const signOut = async () => {
    await ApiClient.signOut();
  };

  return { register, signIn, signOut };
};
