// app/(Kambaz)/Account/Profile/page.tsx
"use client";

import Link from "next/link";
import { Form, Button } from "react-bootstrap";

export default function Profile() {
    return (
        <div id="wd-profile-screen" className="pt-2">
            <h2 className="mb-3">Profile</h2>

            <Form className="w-100" style={{ maxWidth: 520 }}>
                <Form.Control defaultValue="coco" placeholder="username" className="mb-2" />
                <Form.Control defaultValue="123" type="password" placeholder="password" className="mb-2" />

                <div className="row g-2">
                    <div className="col-sm-6">
                        <Form.Control defaultValue="Coco" placeholder="First Name" />
                    </div>
                    <div className="col-sm-6">
                        <Form.Control defaultValue="Choi" placeholder="Last Name" />
                    </div>
                </div>

                <Form.Control defaultValue="2000-03-28" type="date" className="mt-2 mb-2" />
                <Form.Control defaultValue="coco@example.com" type="email" className="mb-2" />

                <Form.Select defaultValue="STUDENT" className="mb-3">
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="STUDENT">Student</option>
                </Form.Select>

                <Link href="/Account/Signin" className="btn btn-danger w-100">
                    Signout
                </Link>
            </Form>
        </div>
    );
}
