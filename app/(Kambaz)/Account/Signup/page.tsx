"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "react-bootstrap";
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

        if (!user.username || !user.password) return setError("Please enter username and password");
        if (user.password !== user.verifyPassword) return setError("Passwords do not match");

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
                    {/* fields unchanged */}
                    {/* ... */}
                </form>
            </div>
        </div>
    );
}
