import React, { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import ky from 'ky';
import { LoadingPage } from '../pages';
import { AppConfig } from '../types/app-config';
import { ErrorPage } from '../pages/error-page';

interface AppConfigProviderProps {
  config: AppConfig;
}

const AppConfigContext = createContext<AppConfigProviderProps | null>(null);

const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    data: config,
    isLoading: isAppConfigLoading,
    isError: isAppConfigError,
    isFetched: isAppConfigFetched,
  } = useQuery({
    queryKey: ['appConfig'],
    queryFn: () =>
      ky
        .get('metadata/app-config', {
          prefixUrl: import.meta.env.VITE_API_URL,
          mode: 'cors',
        })
        .json<AppConfig>(),
  });

  if (!isAppConfigFetched || isAppConfigLoading) {
    return <LoadingPage />;
  }

  if (!config || isAppConfigError) {
    return <ErrorPage />;
  }

  return (
    <AppConfigContext.Provider
      value={{
        config,
      }}
    >
      {children}
    </AppConfigContext.Provider>
  );
};

const useAppConfigContext = (): AppConfigProviderProps => {
  const context = useContext(AppConfigContext);

  if (!context) {
    throw new Error(
      'Failed to load app config context. Make sure you are consuming the context within a provider block'
    );
  }

  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AppConfigProvider, useAppConfigContext };
