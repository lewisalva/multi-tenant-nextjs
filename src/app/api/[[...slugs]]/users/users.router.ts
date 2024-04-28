import { Elysia, error } from 'elysia';

import { ensureAuthentication } from '../../../../server/globalMiddleware/authentication';
import { findUser, updateUser, updateUserSchema } from '../../../../server/models/User';

export const usersRouter = new Elysia({ prefix: '/users' })
  .use(ensureAuthentication)
  .get('/me', async ({ user }) => {
    const simpleUser = await findUser(user.id);
    if (!simpleUser) {
      return error(401);
    }

    return simpleUser;
  })
  .put(
    '/me',
    async ({ user, body, set }) => {
      await updateUser(user.id, body);
      set.status = 204;
    },
    { body: updateUserSchema }
  );
