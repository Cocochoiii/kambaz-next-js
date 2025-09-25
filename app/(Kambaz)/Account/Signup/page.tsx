"use client";

import Link from "next/link";

export default function Signup() {
    return (
        <div id="wd-signup-screen" className="mx-auto" style={{ maxWidth: 420 }}>
            <h1 className="mb-3">Signup</h1>

            <input
                placeholder="username"
                className="form-control mb-2"
                id="wd-su-username"
            />
            <input
                placeholder="password"
                type="password"
                className="form-control mb-2"
                id="wd-su-password"
            />
            <input
                placeholder="verify password"
                type="password"
                className="form-control mb-2"
                id="wd-su-password-verify"
            />

            <Link
                href="/Account/Profile"
                className="btn btn-primary w-100 mb-2"
                id="wd-signup-btn"
            >
                Signup
            </Link>

            <Link href="/Account/Signin" className="link-primary">
                Signin
            </Link>
        </div>
    );
}
