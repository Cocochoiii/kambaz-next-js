// When someone opens "/Account", I send them to the Sign in screen.
import { redirect } from "next/navigation";

export default function AccountPage() {
  redirect("/Account/Signin");
}
