// The Sign in screen.
// "Sign in" goes to the Dashboard. "Sign up" goes to the Sign up screen.
import Link from "next/link";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <input type="text" placeholder="username" defaultValue="coco" className="wd-username" /><br />
      <input type="password" placeholder="password" defaultValue="123" className="wd-password" /><br />
      <Link id="wd-signin-btn" href="/Dashboard"> Sign in </Link><br />
      <Link id="wd-signup-link" href="/Account/Signup"> Sign up </Link>
    </div>
  );
}
