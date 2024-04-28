import { treaty } from '@elysiajs/eden';
import { describe, expect, test } from 'bun:test';

import { getAuthHeaders } from '../../../tests/utils';
import { usersRouter } from './users.router';

const usersApi = treaty(usersRouter);

describe('users.router', () => {
  describe('get /me', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await usersApi.users.me.get();

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });
  });

  test('it returns with user id', async () => {
    const headers = await getAuthHeaders();
    const { status, data } = await usersApi.users.me.get({ headers });

    expect(status).toEqual(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('email', 'lewis@j1.support');
  });

  describe('put /me', () => {
    test('it throws 401 when no auth cookie is sent', async () => {
      const { status, error } = await usersApi.users.me.put({ name: 'hi mom' });

      expect(status).toEqual(401);
      expect(error?.value).toEqual('Unauthorized');
    });

    test('it updates the user', async () => {
      const headers = await getAuthHeaders();
      const { status } = await usersApi.users.me.put({ name: 'hi mom' }, { headers });

      expect(status).toEqual(204);
    });
  });
});
