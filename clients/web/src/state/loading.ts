import { atom } from 'recoil';

export const loadingState = atom({
  key: 'loading',
  default: false,
});
