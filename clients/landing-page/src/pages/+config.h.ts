import type { Config } from 'vike/types';

export default {
  meta: {
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    data: { env: { server: true } },
  },
} satisfies Config;
