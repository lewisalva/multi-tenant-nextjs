'use server';

import { cookies } from "next/headers";
import { type SignUpUser, createSessionCookie, createUser, type LoginUser, checkUserPassword } from "../../server/models/User";
import { getUserSession } from "./session";
import { lucia } from "../../server/globalMiddleware/authentication";

export const signin = async ({email, password}: LoginUser) => {
  const user = await checkUserPassword({ email, password });

  if (!user) {
    return new Error('Not Found');
  }

  const sessionCookie = await createSessionCookie(user.id);
  cookies().set({
    name: sessionCookie.name,
    value: sessionCookie.value,
    ...sessionCookie.attributes,
  });

  return true;
};

export const signup = async ({email, name, password}: SignUpUser) => {
  const userId = await createUser({ email, name, password });

  const sessionCookie = await createSessionCookie(userId);
  cookies().set({
    name: sessionCookie.name,
    value: sessionCookie.value,
    ...sessionCookie.attributes,
  });

  return true;
};

export const signout = async () => {
  const { session } = await getUserSession();
  if (!session) {
    return false;
  }

  session.id && (await lucia.invalidateSession(session.id));
  cookies().delete(lucia.sessionCookieName);

  return true;
};
