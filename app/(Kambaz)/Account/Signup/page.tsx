"use client";

// The Sign up screen.
// The server makes the account and signs me in.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import { setEnrollments } from "../../Enrollments/reducer";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    verify: "",
    role: "FACULTY",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signup = async () => {
    if (!user.username || !user.password) {
      setError("Please type a username and a password");
      return;
    }
    if (user.password !== user.verify) {
      setError("The two passwords are not the same");
      return;
    }
    try {
      const currentUser = await client.signup({
        username: user.username,
        password: user.password,
        role: user.role,
      });
      dispatch(setCurrentUser(currentUser));
      // A new user has no courses yet.
      dispatch(setEnrollments([]));
      router.push("/Account/Profile");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to sign up");
    }
  };

  return (
    <div id="wd-signup-screen" style={{ maxWidth: 300 }}>
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
      <Form.Select
        id="wd-su-role"
        className="form-control mb-2"
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
      >
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
      </Form.Select>
      <Button id="wd-signup-btn" onClick={signup} className="btn btn-primary w-100 mb-2">
        Sign up
      </Button>
      <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
    </div>
  );
}
