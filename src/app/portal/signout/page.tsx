'use server';

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { lucia } from "../../../server/globalMiddleware/authentication";

export default async function SignOutPage() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  sessionId && (await lucia.invalidateSession(sessionId));

  cookies().set(lucia.sessionCookieName, '', { expires: new Date(0) });

  return redirect('/signin');
}
