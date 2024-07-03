'use server';

import { redirect } from "next/navigation";
import { auth } from "~/app/authentication";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await auth();

  if (user !== null) {
    return redirect('/portal/organizations');
  }

  return children;
}
