import { Elysia } from 'elysia';

import { ensureAuthentication, lucia } from '../../globalMiddleware/authentication';

export const signoutPost = new Elysia()
  .use(ensureAuthentication)
  .post('/signout', async ({ cookie, session, set }) => {
    session.id && (await lucia.invalidateSession(session.id));

    delete cookie[lucia.sessionCookieName];

    set.status = 204;
  });
