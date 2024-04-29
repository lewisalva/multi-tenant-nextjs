import { useRouter } from "next/navigation";
import { auth } from "~/app/authentication";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = auth();
  const router = useRouter();

  if (user !== null) {
    void router.push('/portal/organizations');
    return null;
  }

  return children;
}
