"use client";

// 4.11 The Sign in screen.
// I look for the username and the password in the users of the Database.
// If I find the user I put it in the store and go to the Dashboard.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import * as db from "../../Database";

export default function Signin() {
  // I start with a Faculty account, because Faculty can do everything.
  // The note under the button also gives a student account.
  const [credentials, setCredentials] = useState({ username: "sstrange", password: "678" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = () => {
    const user = db.users.find(
      (u: any) =>
        u.username === credentials.username && u.password === credentials.password
    );
    if (!user) {
      setError("Wrong username or password");
      return;
    }
    dispatch(setCurrentUser(user));
    router.push("/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>

      {error && <Alert variant="danger" id="wd-signin-error">{error}</Alert>}

      <Form.Control
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
      />
      <Form.Control
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <Button id="wd-signin-btn" onClick={signin} className="btn btn-primary w-100 mb-2">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>

      {/* The accounts to try. */}
      <div className="text-muted small mt-3" id="wd-signin-accounts">
        <div><b>Faculty:</b> sstrange / 678</div>
        <div><b>Student:</b> coco / 123</div>
      </div>
    </div>
  );
}
