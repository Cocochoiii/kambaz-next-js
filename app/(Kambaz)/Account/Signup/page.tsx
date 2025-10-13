"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import api from "@/app/lib/api";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const signup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!user.username || !user.password) {
            return setError("Please enter username and password");
        }
        if (user.password !== user.verifyPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        try {
            await api.post("/users/signup", {
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
            setError(err?.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="wd-signup-screen" className="account-container">
            <div className="account-box account-box-signup">
                <h1 className="account-title">Create Account</h1>
                <form onSubmit={signup} className="account-form">
                    <div className="form-floating-group">
                        <input
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            id="wd-username"
                            type="text"
                            required
                            autoFocus
                        />
                        <label className="account-label" htmlFor="wd-username">Username</label>
                    </div>

                    <div className="form-floating-group">
                        <input
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            type="password"
                            id="wd-password"
                            required
                        />
                        <label className="account-label" htmlFor="wd-password">Password</label>
                    </div>

                    <div className="form-floating-group">
                        <input
                            value={user.verifyPassword}
                            onChange={(e) => setUser({ ...user, verifyPassword: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            type="password"
                            id="wd-verify-password"
                            required
                        />
                        <label className="account-label" htmlFor="wd-verify-password">Verify Password</label>
                    </div>

                    <div className="row g-3">
                        <div className="col-sm-6">
                            <div className="form-floating-group">
                                <input
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                    className="account-input"
                                    placeholder=" "
                                    id="wd-firstname"
                                    type="text"
                                />
                                <label className="account-label" htmlFor="wd-firstname">First Name</label>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-floating-group">
                                <input
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                    className="account-input"
                                    placeholder=" "
                                    id="wd-lastname"
                                    type="text"
                                />
                                <label className="account-label" htmlFor="wd-lastname">Last Name</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-floating-group">
                        <input
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            type="email"
                            id="wd-email"
                        />
                        <label className="account-label" htmlFor="wd-email">Email</label>
                    </div>

                    <div className="form-floating-group">
                        <select
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="account-input account-select"
                            id="wd-role"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                        <label className="account-label" htmlFor="wd-role">Role</label>
                    </div>

                    {error && <div className="account-error">{error}</div>}

                    <Button type="submit" id="wd-signup-btn" className="account-btn-primary" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>

                    <div className="account-link-container">
                        <Link id="wd-signin-link" href="/Account/Signin" className="account-link">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}