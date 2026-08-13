"use client";

// The Sign in screen, now styled with Bootstrap.
// "Sign in" goes to the Dashboard. "Sign up" goes to the Sign up screen.
// I need "use client" because React Bootstrap uses React context.
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <Form.Control id="wd-username" placeholder="username" defaultValue="coco" className="mb-2" />
      <Form.Control id="wd-password" placeholder="password" type="password" defaultValue="123" className="mb-2" />
      <Link id="wd-signin-btn" href="/Dashboard" className="btn btn-primary w-100 mb-2">
        Sign in
      </Link>
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div>
  );
}
