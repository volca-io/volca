import React, { useContext, useState } from 'react';
import { createContext } from 'react';

interface UserProviderProps {
  loading: boolean;
  setLoading: (val: boolean) => void;
}

const LoadingContext = createContext<UserProviderProps | null>(null);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoadingContext = (): UserProviderProps => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error('Failed to load user context. Make sure you are consuming the context within a provider block');
  }

  return context;
};
