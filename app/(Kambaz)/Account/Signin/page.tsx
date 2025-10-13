"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import api from "@/app/lib/api";

export default function Signin() {
    const [credentials, setCredentials] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const signin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await api.post("/users/signin", credentials);
            dispatch(setCurrentUser(data));
            router.push("/Dashboard");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="wd-signin-screen" className="account-container">
            <div className="account-box">
                <h1 className="account-title">Northeastern University</h1>
                <form onSubmit={signin} className="account-form">
                    <div className="form-floating-group">
                        <input
                            value={credentials.username || ""}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            id="wd-username"
                            type="text"
                            required
                            autoFocus
                        />
                        <label className="account-label" htmlFor="wd-username">myNortheastern Username</label>
                    </div>
                    <div className="form-floating-group">
                        <input
                            value={credentials.password || ""}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            className="account-input"
                            placeholder=" "
                            type="password"
                            id="wd-password"
                            required
                        />
                        <label className="account-label" htmlFor="wd-password">myNortheastern Password</label>
                    </div>
                    {error && <div className="account-error">{error}</div>}
                    <Button type="submit" id="wd-signin-btn" className="account-btn-primary" disabled={loading}>
                        {loading ? "Signing in..." : "Log In"}
                    </Button>
                    <div className="account-link-container">
                        <Link id="wd-signup-link" href="/Account/Signup" className="account-link">
                            Don't have an account? Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
