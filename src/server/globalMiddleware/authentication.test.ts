
import { treaty } from '@elysiajs/eden';
import { describe, expect, test } from 'bun:test';
import Elysia from 'elysia';

import { getAuthHeaders } from '../tests/utils';
import { ensureAuthentication, lucia } from './authentication';

const app = new Elysia().use(ensureAuthentication).get('', () => 'Hello World');
const api = treaty(app);

describe('Authentication Middleware', () => {
  test('it returns 401 if no auth cookie is provided', async () => {
    const { status, error } = await api.index.get();

    expect(status).toEqual(401);
    expect(error?.value).toEqual('Unauthorized');
  });

  test('it returns 401 if invalid auth cookie is provided', async () => {
    const cookie = `${lucia.sessionCookieName}=invalid-session-id`;
    const { status, error } = await api.index.get({ headers: { cookie } });

    expect(status).toEqual(401);
    expect(error?.value).toEqual('Unauthorized');
  });

  test('it returns 200 if valid auth cookie is provided', async () => {
    const headers = await getAuthHeaders();
    const { status, data } = await api.index.get({ headers });

    expect(status).toEqual(200);
    expect(data).toEqual('Hello World');
  });
});
