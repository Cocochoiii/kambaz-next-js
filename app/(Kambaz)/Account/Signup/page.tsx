"use client";

// The Sign up screen. I style it like the Sign in screen.
// "Sign up" goes to the Profile screen. "Sign in" goes back to Sign in.
// I need "use client" because React Bootstrap uses React context.
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signup() {
  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      <Form.Control id="wd-su-username" placeholder="username" defaultValue="new_user" className="mb-2" />
      <Form.Control id="wd-su-password" placeholder="password" type="password" defaultValue="123" className="mb-2" />
      <Form.Control id="wd-su-password-verify" placeholder="verify password" type="password" defaultValue="123" className="mb-2" />
      <Link id="wd-signup-btn" href="/Account/Profile" className="btn btn-primary w-100 mb-2">
        Sign up
      </Link>
      <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
    </div>
  );
}
