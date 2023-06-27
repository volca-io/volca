import { useApiActions } from './api-actions';

export const useMetadataActions = () => {
  const { executeApiAction } = useApiActions();

  const getAppConfig = () =>
    executeApiAction<any>({
      action: async ({ publicClient }) => {
        const config = await publicClient.get('metadata/app-config').json<any>();
        return config;
      },
    });

  return {
    getAppConfig,
  };
};
