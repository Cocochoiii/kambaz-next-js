"use client";

// The Profile screen.
// Save writes to the server. Sign out ends the session there too.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Form } from "react-bootstrap";
import { setCurrentUser } from "../reducer";
import { setEnrollments } from "../../Enrollments/reducer";
import * as client from "../client";

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [message, setMessage] = useState("");
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/Account/Signin");
      return;
    }
    setProfile(currentUser);
  }, [currentUser, router]);

  const save = async () => {
    try {
      const updated = await client.updateUser(profile);
      dispatch(setCurrentUser(updated));
      setMessage("Profile saved on the server");
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Unable to save the profile");
    }
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    dispatch(setEnrollments([]));
    router.push("/Account/Signin");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>

      {message && <Alert variant="info" id="wd-profile-message">{message}</Alert>}

      <Form.Control
        id="wd-username"
        placeholder="username"
        className="mb-2"
        value={profile.username || ""}
        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
      />
      <Form.Control
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
        value={profile.password || ""}
        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
      />
      <Form.Control
        id="wd-firstname"
        placeholder="First Name"
        className="mb-2"
        value={profile.firstName || ""}
        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
      />
      <Form.Control
        id="wd-lastname"
        placeholder="Last Name"
        className="mb-2"
        value={profile.lastName || ""}
        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
      />
      <Form.Control
        id="wd-dob"
        type="date"
        className="mb-2"
        value={profile.dob || ""}
        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
      />
      <Form.Control
        id="wd-email"
        type="email"
        placeholder="email"
        className="mb-2"
        value={profile.email || ""}
        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
      />
      <Form.Select
        id="wd-role"
        className="form-control mb-2"
        value={profile.role || "USER"}
        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
        <option value="FACULTY">Faculty</option>
        <option value="STUDENT">Student</option>
      </Form.Select>
      <Button id="wd-save-profile-btn" onClick={save} className="btn btn-primary w-100 mb-2">
        Save
      </Button>
      <Button id="wd-signout-btn" onClick={signout} className="btn btn-danger w-100">
        Sign out
      </Button>
    </div>
  );
}
