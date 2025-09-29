"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";

export default function Signup() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        verifyPassword: "",
        role: "STUDENT", // default role
    });
    const router = useRouter();

    const signup = () => {
        // Basic validation
        if (!user.username || !user.password) {
            alert("Please enter username and password");
            return;
        }
        if (user.password !== user.verifyPassword) {
            alert("Passwords do not match");
            return;
        }

        // In a real app, you'd save the user (including role) to the database here
        // For now, just redirect to signin
        router.push("/Account/Signin");
    };

    return (
        <div id="wd-signup-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1 className="mb-3">Signup</h1>

            <Form.Control
                placeholder="username"
                className="mb-2"
                id="wd-su-username"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
            />
            <Form.Control
                placeholder="password"
                type="password"
                className="mb-2"
                id="wd-su-password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
            <Form.Control
                placeholder="verify password"
                type="password"
                className="mb-2"
                id="wd-su-password-verify"
                value={user.verifyPassword}
                onChange={(e) => setUser({ ...user, verifyPassword: e.target.value })}
            />

            {/* Role selector (same style as Profile) */}
            <Form.Select
                value={user.role}
                id="wd-su-role"
                className="mb-3"
                onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
            </Form.Select>

            <Button
                onClick={signup}
                className="btn btn-primary w-100 mb-2"
                id="wd-signup-btn"
            >
                Signup
            </Button>

            <Link href="/Account/Signin" className="link-primary">
                Signin
            </Link>
        </div>
    );
}
