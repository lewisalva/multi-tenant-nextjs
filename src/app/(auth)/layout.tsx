'use client';

import { useRouter } from "next/navigation";
import { useAuthenticationContext } from "../../web/contexts/useAuthenticationContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useAuthenticationContext();
  const router = useRouter();

  if (isLoggedIn === true) {
    void router.push('/portal/organizations');
    return null;
  }

  return children;
}
