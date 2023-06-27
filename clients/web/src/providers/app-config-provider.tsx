import React, { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import ky from 'ky';
import { LoadingPage } from '../pages';
import { AppConfig } from '../types/app-config';
import { useAsyncError } from '../hooks';

interface AppConfigProviderProps {
  config: AppConfig;
}

const AppConfigContext = createContext<AppConfigProviderProps | null>(null);

export const AppConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>();
  const throwError = useAsyncError();

  const fetchConfig = async () => {
    const resp = await ky.get('metadata/app-config', {
      prefixUrl: process.env.REACT_APP_API_URL,
      mode: 'cors',
    });

    const body = await resp.json<AppConfig>();

    setConfig(body);
  };

  useEffect(() => {
    fetchConfig().catch((error) => {
      throwError(error);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!config) {
    return <LoadingPage />;
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

export const useAppConfigContext = (): AppConfigProviderProps => {
  const context = useContext(AppConfigContext);

  if (!context) {
    throw new Error(
      'Failed to load app config context. Make sure you are consuming the context within a provider block'
    );
  }

  return context;
};
