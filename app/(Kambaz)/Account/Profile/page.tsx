"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { Form, Button } from "react-bootstrap";
import api from "@/app/lib/api";

export default function Profile() {
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
        try {
            const { data } = await api.put(`/users/${profile._id}`, profile);
            dispatch(setCurrentUser(data));
            alert("Profile updated successfully!");
            router.push("/Dashboard");
        } catch (err) {
            console.error(err);
            alert("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    const signout = async () => {
        try {
            await api.post("/users/signout");
            dispatch(setCurrentUser(null));
            router.push("/Account/Signin");
        } catch (err) {
            console.error(err);
            dispatch(setCurrentUser(null));
            router.push("/Account/Signin");
        }
    };

    if (!profile || !profile.username) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <div id="wd-profile-screen" className="account-form-container">
            <h1 className="account-header mb-4">Profile</h1>
            <Form className="account-form">
                <div className="form-floating-group">
                    <Form.Control
                        value={profile.username || ""}
                        id="wd-username"
                        placeholder=" "
                        className="account-input"
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    />
                    <Form.Label className="account-label">Username</Form.Label>
                </div>
                <div className="form-floating-group">
                    <Form.Control
                        value={profile.password || ""}
                        id="wd-password"
                        type="password"
                        placeholder=" "
                        className="account-input"
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                    />
                    <Form.Label className="account-label">Password</Form.Label>
                </div>
                <div className="row g-3">
                    <div className="col-sm-6">
                        <div className="form-floating-group">
                            <Form.Control
                                value={profile.firstName || ""}
                                id="wd-firstname"
                                placeholder=" "
                                className="account-input"
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            />
                            <Form.Label className="account-label">First Name</Form.Label>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="form-floating-group">
                            <Form.Control
                                value={profile.lastName || ""}
                                id="wd-lastname"
                                placeholder=" "
                                className="account-input"
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            />
                            <Form.Label className="account-label">Last Name</Form.Label>
                        </div>
                    </div>
                </div>
                <div className="form-floating-group">
                    <Form.Control
                        value={profile.dob || ""}
                        id="wd-dob"
                        type="date"
                        placeholder=" "
                        className="account-input"
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                    />
                    <Form.Label className="account-label">Date of Birth</Form.Label>
                </div>
                <div className="form-floating-group">
                    <Form.Control
                        value={profile.email || ""}
                        id="wd-email"
                        type="email"
                        placeholder=" "
                        className="account-input"
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Form.Label className="account-label">Email</Form.Label>
                </div>
                <div className="form-floating-group">
                    <Form.Select
                        value={profile.role || "USER"}
                        id="wd-role"
                        className="account-input account-select"
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    >
                        <option value="STUDENT">Student</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="ADMIN">Admin</option>
                        <option value="USER">User</option>
                    </Form.Select>
                    <Form.Label className="account-label">Role</Form.Label>
                </div>
                <Button onClick={updateProfile} className="account-btn-primary mb-3" id="wd-update-profile-btn" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                </Button>
                <Button onClick={signout} className="account-btn-secondary" id="wd-signout-btn">
                    Sign out
                </Button>
            </Form>
        </div>
    );
}
