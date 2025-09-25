"use client";

import Link from "next/link";

export default function Signin() {
    return (
        <div id="wd-signin-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1 className="mb-3">Signin</h1>

            <input
                id="wd-username"
                placeholder="username"
                className="form-control mb-2"
            />
            <input
                id="wd-password"
                placeholder="password"
                type="password"
                className="form-control mb-2"
            />

            <Link
                id="wd-signin-btn"
                href="/Dashboard"
                className="btn btn-primary w-100 mb-2"
            >
                Signin
            </Link>

            <Link id="wd-signup-link" href="/Account/Signup" className="link-primary">
                Signup
            </Link>
        </div>
    );
}
