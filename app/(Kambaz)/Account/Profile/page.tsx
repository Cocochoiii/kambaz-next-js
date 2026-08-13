"use client";

// The Profile screen. I style it like the Sign in screen.
// "Sign out" goes back to the Sign in screen.
// I need "use client" because React Bootstrap uses React context.
import Link from "next/link";
import { Form } from "react-bootstrap";

export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <Form.Control id="wd-username" defaultValue="coco" placeholder="username" className="mb-2" />
      <Form.Control id="wd-password" defaultValue="123" placeholder="password" type="password" className="mb-2" />
      <Form.Control id="wd-firstname" defaultValue="Coco" placeholder="First Name" className="mb-2" />
      <Form.Control id="wd-lastname" defaultValue="Choi" placeholder="Last Name" className="mb-2" />
      <Form.Control id="wd-dob" defaultValue="2000-03-28" type="date" className="mb-2" />
      <Form.Control id="wd-email" defaultValue="coco@example.com" type="email" className="mb-2" />
      <Form.Select id="wd-role" defaultValue="STUDENT" className="form-control mb-2">
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>
      <Link id="wd-signout-btn" href="/Account/Signin" className="btn btn-danger w-100">
        Sign out
      </Link>
    </div>
  );
}
