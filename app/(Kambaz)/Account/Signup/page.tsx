"use client";

// The Sign up screen. There is no server yet, so I only build the user
// in the browser, put it in the store, and go to the Profile screen.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { setCurrentUser } from "../reducer";

export default function Signup() {
  const [user, setUser] = useState({ username: "new_user", password: "123", verify: "123" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = () => {
    if (!user.username) {
      setError("Please type a username");
      return;
    }
    if (user.password !== user.verify) {
      setError("The two passwords are not the same");
      return;
    }
    dispatch(setCurrentUser({
      _id: new Date().getTime().toString(),
      username: user.username,
      password: user.password,
      firstName: "",
      lastName: "",
      email: "",
      dob: "",
      role: "STUDENT",
    }));
    router.push("/Account/Profile");
  };

  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>

      {error && <Alert variant="danger" id="wd-signup-error">{error}</Alert>}

      <Form.Control
        id="wd-su-username"
        placeholder="username"
        className="mb-2"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
      />
      <Form.Control
        id="wd-su-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
      />
      <Form.Control
        id="wd-su-password-verify"
        placeholder="verify password"
        type="password"
        className="mb-2"
        value={user.verify}
        onChange={(e) => setUser({ ...user, verify: e.target.value })}
      />
      <Button id="wd-signup-btn" onClick={signup} className="btn btn-primary w-100 mb-2">
        Sign up
      </Button>
      <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
    </div>
  );
}
