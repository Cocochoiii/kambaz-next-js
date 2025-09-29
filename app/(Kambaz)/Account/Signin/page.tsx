"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import * as db from "../../Database";
import { Form, Button } from "react-bootstrap";

export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();

    const signin = () => {
        const user = db.users.find(
            (u: any) => u.username === credentials.username && u.password === credentials.password
        );
        if (!user) {
            alert("Invalid username or password");
            return;
        }
        dispatch(setCurrentUser(user));
        router.push("/Dashboard");
    };

    return (
        <div id="wd-signin-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1>Sign in</h1>
            <Form.Control
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="mb-2"
                placeholder="username"
                id="wd-username"
                autoFocus
            />
            <Form.Control
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mb-2"
                placeholder="password"
                type="password"
                id="wd-password"
            />
            <Button onClick={signin} id="wd-signin-btn" className="w-100 btn-primary">
                Sign in
            </Button>
            <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
        </div>
    );
}
