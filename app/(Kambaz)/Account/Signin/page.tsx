"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import * as client from "../client";
import { Form, Button } from "react-bootstrap";

export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();

    const signin = async () => {
        try {
            const user = await client.signin(credentials);
            dispatch(setCurrentUser(user));
            router.push("/Dashboard");
        } catch (err: any) {
            alert(err?.response?.data?.message || "Invalid username or password");
        }
    };

    return (
        <div id="wd-signin-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1>Sign in</h1>
            <Form.Control
                value={credentials.username || ""}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="mb-2"
                placeholder="username"
                id="wd-username"
                autoFocus
            />
            <Form.Control
                value={credentials.password || ""}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="mb-2"
                placeholder="password"
                type="password"
                id="wd-password"
            />
            <Button onClick={signin} id="wd-signin-btn" className="w-100 btn-primary mb-2">
                Sign in
            </Button>
            <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
        </div>
    );
}
