import { createContext, useEffect, useState } from 'react';
import { ApiClient } from '../lib/clients/api-client';
import { User } from '../types';

export type UserContextProps = {
  user?: User | null;
  loadUser: () => void;
  clearUser: () => void;
};

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserContext = createContext({
  user: null,
  loadUser: () => {},
} as UserContextProps);

export const UserConsumer = UserContext.Consumer;

export const UserProvider = ({ children }: UserProviderProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const loadUser = async () => {
    try {
      const user = await ApiClient.getMe();
      setUser(user);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const clearUser = async () => {
    setUser(null);
  };

  useEffect(() => {
    const getMe = async () => {
      await loadUser();
      setInitialized(true);
    };

    getMe();
  }, []);

  if (!initialized) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loadUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
