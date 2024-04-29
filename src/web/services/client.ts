import { treaty } from '@elysiajs/eden';

import type { API } from '~/server/routes';

export const client = treaty<API>('http://localhost:3000/');
export const authenticatedClient = treaty<API>('http://localhost:3000/', {
  fetch: { credentials: 'include' },
});

export type Schema = API['_routes'];
