"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Form, Button } from "react-bootstrap";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    const fetchProfile = () => {
        if (!currentUser) {
            router.push("/Account/Signin");
            return;
        }
        setProfile(currentUser);
    };

    const updateProfile = () => {
        // Update the currentUser in Redux with the edited profile
        dispatch(setCurrentUser(profile));
        // ➜ After saving, go to Dashboard so the UI reflects the role immediately
        router.push("/Dashboard");
    };

    const signout = () => {
        dispatch(setCurrentUser(null));
        router.push("/Account/Signin");
    };

    useEffect(() => {
        fetchProfile();
    }, [currentUser]);

    // If no profile data yet, show loading or redirect
    if (!profile || !profile.username) {
        return <div>Loading...</div>;
    }

    return (
        <div id="wd-profile-screen" className="pt-2">
            <h2 className="mb-3">Profile</h2>

            <Form className="w-100" style={{ maxWidth: 520 }}>
                <Form.Control
                    value={profile.username || ""}
                    id="wd-username"
                    placeholder="username"
                    className="mb-2"
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                />
                <Form.Control
                    value={profile.password || ""}
                    id="wd-password"
                    type="password"
                    placeholder="password"
                    className="mb-2"
                    onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                />

                <div className="row g-2">
                    <div className="col-sm-6">
                        <Form.Control
                            value={profile.firstName || ""}
                            id="wd-firstname"
                            placeholder="First Name"
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                    </div>
                    <div className="col-sm-6">
                        <Form.Control
                            value={profile.lastName || ""}
                            id="wd-lastname"
                            placeholder="Last Name"
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <Form.Control
                    value={profile.dob || ""}
                    id="wd-dob"
                    type="date"
                    className="mt-2 mb-2"
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                />
                <Form.Control
                    value={profile.email || ""}
                    id="wd-email"
                    type="email"
                    placeholder="email"
                    className="mb-2"
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />

                <Form.Select
                    value={profile.role || "USER"}
                    id="wd-role"
                    className="mb-3"
                    onChange={(e) => {
                        const updatedProfile = { ...profile, role: e.target.value };
                        setProfile(updatedProfile);
                        // Immediately update Redux when role changes
                        dispatch(setCurrentUser(updatedProfile));
                    }}
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="STUDENT">Student</option>
                </Form.Select>

                <Button
                    onClick={updateProfile}
                    className="w-100 btn-primary mb-2"
                    id="wd-update-profile-btn"
                >
                    Update Profile
                </Button>

                <Button
                    onClick={signout}
                    className="w-100 btn-danger"
                    id="wd-signout-btn"
                >
                    Sign out
                </Button>
            </Form>
        </div>
    );
}
