// This is the first page of the app.
// When someone opens "/", I send them to the Sign in screen.
import { redirect } from "next/navigation";

export default function Kambaz() {
  redirect("/Account/Signin");
}
