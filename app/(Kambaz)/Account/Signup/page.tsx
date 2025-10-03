"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api";

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
            setError("Please enter username and password");
            return;
        }
        if (user.password !== user.verifyPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
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
            setError(err.response?.data?.message || "Signup failed");
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
                            placeholder=" "
                            className="account-input"
                            id="wd-su-username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            required
                            autoFocus
                        />
                        <label className="account-label" htmlFor="wd-su-username">Username</label>
                    </div>

                    <div className="form-floating-group">
                        <input
                            placeholder=" "
                            type="password"
                            className="account-input"
                            id="wd-su-password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            required
                        />
                        <label className="account-label" htmlFor="wd-su-password">Password</label>
                    </div>

                    <div className="form-floating-group">
                        <input
                            placeholder=" "
                            type="password"
                            className="account-input"
                            id="wd-su-password-verify"
                            value={user.verifyPassword}
                            onChange={(e) => setUser({ ...user, verifyPassword: e.target.value })}
                            required
                        />
                        <label className="account-label" htmlFor="wd-su-password-verify">Verify Password</label>
                    </div>

                    <div className="row g-3">
                        <div className="col-sm-6">
                            <div className="form-floating-group">
                                <input
                                    placeholder=" "
                                    className="account-input"
                                    value={user.firstName}
                                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                                />
                                <label className="account-label">First Name</label>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-floating-group">
                                <input
                                    placeholder=" "
                                    className="account-input"
                                    value={user.lastName}
                                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                                />
                                <label className="account-label">Last Name</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-floating-group">
                        <input
                            placeholder=" "
                            type="email"
                            className="account-input"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                        <label className="account-label">Email</label>
                    </div>

                    <div className="form-floating-group">
                        <select
                            value={user.role}
                            id="wd-su-role"
                            className="account-input account-select"
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="FACULTY">Faculty</option>
                            <option value="ADMIN">Admin</option>
                            <option value="USER">User</option>
                        </select>
                        <label className="account-label" htmlFor="wd-su-role">Role</label>
                    </div>

                    {error && (
                        <div className="account-error">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="account-btn-primary"
                        id="wd-signup-btn"
                        disabled={loading}
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </Button>

                    <div className="account-link-container">
                        <Link href="/Account/Signin" className="account-link">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}