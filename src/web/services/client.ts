import { treaty } from '@elysiajs/eden';

import type { API } from '~/server/routes';

export const client = treaty<API>(global.window?.location?.origin);
export const authenticatedClient = treaty<API>(global.window?.location?.origin, {
  fetch: { credentials: 'include' },
});

export type Schema = API['_routes'];
