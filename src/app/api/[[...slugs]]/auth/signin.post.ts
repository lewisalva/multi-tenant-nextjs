import { Elysia } from 'elysia';

import { checkUserPassword, createSessionCookie, loginUserSchema } from '../../../../server/models/User';

export const signinPost = new Elysia().post(
  '/signin',
  async ({ body: { email, password }, cookie, error, set }) => {
    const user = await checkUserPassword({ email, password });

    if (!user) {
      return error('Not Found');
    }

    const sessionCookie = await createSessionCookie(user.id);

    cookie[sessionCookie.name]?.set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    });

    set.status = 204;
  },
  {
    body: loginUserSchema,
  }
);
