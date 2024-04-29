import { redirect } from "next/navigation";
import { auth } from "~/app/authentication";

export default async function HomePage() {
  const user = await auth();

  if (user) {
    return redirect('/portal');
  }

  return redirect('/signin')
}
