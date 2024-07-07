import { redirect } from "next/navigation";
import { signout } from "../../../web/actions/auth";

export default async function SignOutPage() {
  await signout();

  return redirect('/signin');
}
