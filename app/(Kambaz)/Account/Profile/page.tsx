"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const axiosWithCredentials = axios.create({ withCredentials: true });
const API = "/api"; // ✅

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();
    const { currentUser } = useSelector((state: any) => state.accountReducer);

    useEffect(() => {
        if (!currentUser) {
            router.push("/Account/Signin");
            return;
        }
        setProfile(currentUser);
    }, [currentUser, router]);

    const updateProfile = async () => {
        try {
            const { data } = await axiosWithCredentials.put(
                `${API}/users/${profile._id}`,
                profile
            );
            dispatch(setCurrentUser(data));
            alert("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        }
    };

    const signout = async () => {
        try {
            await axiosWithCredentials.post(`${API}/users/signout`);
            dispatch(setCurrentUser(null));
            router.push("/Account/Signin");
        } catch (err) {
            console.error(err);
            dispatch(setCurrentUser(null));
            router.push("/Account/Signin");
        }
    };

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
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                >
                    <option value="STUDENT">Student</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Admin</option>
                    <option value="USER">User</option>
                </Form.Select>

                <Button onClick={updateProfile} className="w-100 btn-primary mb-2" id="wd-update-profile-btn">
                    Update Profile
                </Button>

                <Button onClick={signout} className="w-100 btn-danger" id="wd-signout-btn">
                    Sign out
                </Button>
            </Form>
        </div>
    );
}
