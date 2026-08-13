// The Sign up screen. New users make an account here.
// "Sign up" goes to the Profile screen. "Sign in" goes back to Sign in.
import Link from "next/link";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h3>Sign up</h3>
      <input type="text" placeholder="username" defaultValue="new_user" className="wd-username" /><br />
      <input type="password" placeholder="password" defaultValue="123" className="wd-password" /><br />
      <input type="password" placeholder="verify password" defaultValue="123" className="wd-password-verify" /><br />
      <Link id="wd-signup-btn" href="/Account/Profile"> Sign up </Link><br />
      <Link id="wd-signin-link" href="/Account/Signin"> Sign in </Link>
    </div>
  );
}
