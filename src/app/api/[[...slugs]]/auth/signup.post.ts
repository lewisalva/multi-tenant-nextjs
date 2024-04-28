import { Elysia, error } from 'elysia';

import { createSessionCookie, createUser, signUpUserSchema } from '~/server/models/User';

export const signupPost = new Elysia().post(
  '/signup',
  async ({ body: { email, name, password }, cookie, set }) => {
    try {
      const userId = await createUser({ email, name, password });

      const sessionCookie = await createSessionCookie(userId);

      cookie[sessionCookie.name]?.set({
        value: sessionCookie.value,
        ...sessionCookie.attributes,
      });

      set.status = 201;
    } catch (err) {
      if (
        err instanceof Error &&
        err.message.includes('duplicate key value violates unique constraint')
      ) {
        return error(409);
      }

      console.error(err);
      return error(500);
    }
  },
  {
    body: signUpUserSchema,
  }
);
