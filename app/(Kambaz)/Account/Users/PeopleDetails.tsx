"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FormControl, FormSelect, Button } from "react-bootstrap";
import { FaUserCircle, FaPencil, FaCheck } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import * as client from "../client";
import {
    updateUser as updateUserAction,
    deleteUser as deleteUserAction,
} from "./reducer";

export default function PeopleDetails() {
    const { uid } = useParams<{ uid: string }>();
    const router = useRouter();
    const dispatch = useDispatch();
    const [user, setUser] = useState<any>(null);
    const [editingName, setEditingName] = useState(false);

    const fetchUser = async () => {
        if (!uid) return;
        setUser(await client.findUserById(uid));
    };
    useEffect(() => {
        fetchUser();
    }, [uid]);

    const save = async () => {
        const updated = await client.updateUser(user); // returns updated user from DB
        dispatch(updateUserAction(updated ?? user));
        setEditingName(false);
    };

    const remove = async () => {
        await client.deleteUser(user._id);
        dispatch(deleteUserAction(user._id));
        router.push("/Account/Users");
    };

    const close = () => router.push("/Account/Users");

    if (!user) return null;

    return (
        <div
            className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-3 shadow border-start"
            style={{ width: 340, zIndex: 1050, overflowY: "auto" }}
        >
            <button
                type="button"
                onClick={close}
                className="btn-close float-end"
                aria-label="Close"
                id="wd-close-people-details"
            />
            <div className="text-center mb-3">
                <FaUserCircle className="text-secondary" style={{ fontSize: 72 }} />
            </div>

            <div className="mb-3">
                {!editingName ? (
                    <div className="fs-5 wd-name">
                        {user.firstName} {user.lastName}
                        <FaPencil
                            role="button"
                            className="ms-2 text-primary fs-6"
                            title="Edit name"
                            onClick={() => setEditingName(true)}
                        />
                    </div>
                ) : (
                    <div className="d-flex gap-1">
                        <FormControl
                            value={user.firstName ?? ""}
                            placeholder="First name"
                            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        />
                        <FormControl
                            value={user.lastName ?? ""}
                            placeholder="Last name"
                            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        />
                        <Button variant="success" onClick={save} title="Save name">
                            <FaCheck />
                        </Button>
                    </div>
                )}
            </div>

            <b>Roles</b>
            <FormSelect
                className="mb-3"
                value={user.role ?? "STUDENT"}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
            >
                <option value="STUDENT">Student</option>
                <option value="TA">Assistant</option>
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrator</option>
            </FormSelect>

            <b>Login ID</b>
            <p className="wd-login-id">{user.loginId}</p>
            <b>Section</b>
            <p className="wd-section">{user.section}</p>
            <b>Total Activity</b>
            <p className="wd-total-activity">{user.totalActivity}</p>

            <Button onClick={save} variant="primary" className="w-100 mb-2" id="wd-save-user">
                Save
            </Button>
            <Button onClick={remove} variant="danger" className="w-100 mb-2" id="wd-delete-user">
                Delete
            </Button>
            <Button onClick={close} variant="secondary" className="w-100">
                Cancel
            </Button>
        </div>
    );
}
