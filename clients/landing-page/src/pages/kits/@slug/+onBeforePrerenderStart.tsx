import { OnBeforePrerenderStartSync } from 'vike/types';
import { kits } from './data';

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = (): ReturnType<OnBeforePrerenderStartSync> =>
kits.map((kit) => '/kits/' + kit.slug);
