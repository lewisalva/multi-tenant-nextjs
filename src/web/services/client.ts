import { treaty } from '@elysiajs/eden';

import type { API } from '~/server/routes';

export const client = treaty<API>('/');
export const authenticatedClient = treaty<API>('/', {
  fetch: { credentials: 'include' },
});

export type Schema = API['_routes'];
