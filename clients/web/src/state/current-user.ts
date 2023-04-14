import { atom } from 'recoil';
import { getClient } from '../lib/api-client';
import { User } from '../types';
import { GetMeResponse } from '../hooks/user-actions';

export const currentUserState = atom<User | null>({
  key: 'current-user',
  default: (async () => {
    if (!localStorage.getItem('access_token')) return null;
    try {
      const { me } = await getClient().get('me').json<GetMeResponse>();
      return me;
    } catch (err: unknown) {
      return null;
    }
  })(),
});
