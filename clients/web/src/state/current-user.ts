import { atom, selector } from 'recoil';
import { ApiClient } from '../lib/clients/api-client';

export const currentUserSelector = selector({
  key: 'current-user-selector',
  get: async ({ get }) => {
    try {
      const resp = await ApiClient.getMe();
      return resp;
    } catch (err: unknown) {
      return null;
    }
  },
});

export const currentUser = atom({
  key: 'current-user',
  default: currentUserSelector,
});
