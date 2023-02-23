import { atom } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';
import { User } from '../types';

export const currentUserState = atom<User | null>({
  key: 'current-user',
  default: (async () => {
    try {
      const { me } = await ApiClient.getMe();
      return me;
    } catch (err: unknown) {
      return null;
    }
  })(),
});
