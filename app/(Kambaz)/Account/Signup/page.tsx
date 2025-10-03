"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api"; // ✅

export default function Signup() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        verifyPassword: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "STUDENT",
    });
    const router = useRouter();

    const signup = async () => {
        if (!user.username || !user.password) {
            alert("Please enter username and password");
            return;
        }
        if (user.password !== user.verifyPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await axiosWithCredentials.post(`${API}/users/signup`, {
                username: user.username,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            });

            alert("Signup successful! Please sign in.");
            router.push("/Account/Signin");
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div id="wd-signup-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1 className="mb-3">Sign up</h1>

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

            <div className="row g-2 mb-2">
                <div className="col-sm-6">
                    <Form.Control
                        placeholder="First Name"
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    />
                </div>
                <div className="col-sm-6">
                    <Form.Control
                        placeholder="Last Name"
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    />
                </div>
            </div>

            <Form.Control
                placeholder="email"
                type="email"
                className="mb-2"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <Form.Select
                value={user.role}
                id="wd-su-role"
                className="mb-3"
                onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
                <option value="STUDENT">Student</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
            </Form.Select>

            <Button onClick={signup} className="btn btn-primary w-100 mb-2" id="wd-signup-btn">
                Sign up
            </Button>

            <Link href="/Account/Signin" className="link-primary">
                Sign in
            </Link>
        </div>
    );
}
