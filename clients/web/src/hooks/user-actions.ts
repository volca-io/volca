import { User } from '../types';
import { useApiActions } from './api-actions';

export type ProvisionUserResponse = {
  me: User;
};

export const useUserActions = () => {
  const { executeApiAction } = useApiActions();

  const provision = ({ idToken }: { idToken?: string }) =>
    executeApiAction<User>({
      action: async ({ publicClient }) => {
        const { me } = await publicClient.post('users/provision', { json: { idToken } }).json<ProvisionUserResponse>();
        return me;
      },
      errorMessage: 'Failed to sign in',
    });

  const sendSupportMessage = (message: string) =>
    executeApiAction({
      action: ({ client }) => client.post('communications/support', { json: { message } }),
      successMessage: 'Thank you for your message!',
      errorMessage: 'Failed to send message',
    });

  return {
    provision,
    sendSupportMessage,
  };
};
