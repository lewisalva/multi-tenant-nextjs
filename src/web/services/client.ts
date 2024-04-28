import { treaty } from '@elysiajs/eden';

import type { API } from '~/app/api/[[...slugs]]/route';

export const client = treaty<API>('http://localhost/');
export const authenticatedClient = treaty<API>('http://localhost/', {
  fetch: { credentials: 'include' },
});

export type Schema = API['_routes'];
