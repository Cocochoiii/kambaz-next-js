"use client";

// The Sign in screen.
// The server checks the password and starts a session.
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import { setEnrollments } from "../../Enrollments/reducer";
import * as client from "../client";

export default function Signin() {
  // The account from the book.
  const [credentials, setCredentials] = useState({
    username: "iron_man",
    password: "stark123",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));

      // Load my courses now, so the menu is right.
      const myCourses = await client.findMyCourses();
      dispatch(
        setEnrollments(
          myCourses.map((course: any) => ({
            _id: `${user._id}-${course._id}`,
            user: user._id,
            course: course._id,
          }))
        )
      );
      router.push("/Dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Wrong username or password");
    }
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

      {/* Two accounts that exist on the server. */}
      <div className="text-muted small mt-3" id="wd-signin-accounts">
        <div><b>Faculty:</b> iron_man / stark123</div>
        <div><b>Student:</b> coco / 123</div>
      </div>
    </div>
  );
}
