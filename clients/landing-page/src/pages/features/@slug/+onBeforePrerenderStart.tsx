import { OnBeforePrerenderStartSync } from 'vike/types';
import { features } from './data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> =>
  features.map((feature) => `/features/${feature.slug}`);
