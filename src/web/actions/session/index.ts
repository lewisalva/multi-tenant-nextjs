'use server';

import { cookies } from "next/headers";
import { lucia } from "../../../server/authentication";

export const getUserSession = async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) {
    return { session: null, user: null};
  }

  return await lucia.validateSession(sessionId);
}
