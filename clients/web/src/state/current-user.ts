import { atom, selector } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';

const currentUserSelector = selector({
  key: 'current-user-selector',
  get: async ({ get }) => {
    try {
      const { me } = await ApiClient.getMe();
      return me;
    } catch (err: unknown) {
      return null;
    }
  },
});

export const currentUserState = atom({
  key: 'current-user',
  default: currentUserSelector,
});
