// app/(Kambaz)/Account/Signup/page.tsx
"use client";

import Link from "next/link";

export default function Signup() {
    return (
        <div id="wd-signup-screen" className="pt-2">
            <h3>Sign up</h3>

            <input
                placeholder="username"
                className="wd-username"
                type="text"
                defaultValue="new_user"
                autoComplete="username"
            />
            <br />

            <input
                placeholder="password"
                className="wd-password"
                type="password"
                defaultValue="123"
                autoComplete="new-password"
            />
            <br />

            <input
                placeholder="verify password"
                className="wd-password-verify"
                type="password"
                defaultValue="123"
                autoComplete="new-password"
            />
            <br />

            <Link href="/Account/Profile">Sign up</Link>
            <br />
            <Link href="/Account/Signin">Sign in</Link>
        </div>
    );
}
