"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Table, Button, FormControl, FormSelect, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaPlus, FaTrash } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../client";
import { setUsers, addUser, deleteUser } from "./reducer";

export default function PeopleTable() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { users } = useSelector((s: any) => s.usersReducer);
    const { currentUser } = useSelector((s: any) => s.accountReducer);
    const isFaculty = currentUser?.role === "FACULTY";

    // client side filters
    const [role, setRole] = useState("");
    const [name, setName] = useState("");

    const loadUsers = async () => {
        dispatch(setUsers(await client.findAllUsers()));
    };
    useEffect(() => {
        loadUsers();
    }, []);

    // +People: create in DB then open it for editing
    const createNewUser = async () => {
        const stamp = Date.now();
        const created = await client.createUser({
            firstName: "New",
            lastName: "User",
            username: `newuser${stamp}`,
            password: "password123",
            email: "",
            role: "STUDENT",
            section: "",
            loginId: `NEW-${stamp}`,
        });
        dispatch(addUser(created));
        router.push(`/Account/Users/${created._id}`);
    };

    const removeUser = async (userId: string) => {
        await client.deleteUser(userId);
        dispatch(deleteUser(userId));
    };

    const shown = users
        .filter((u: any) => (role ? u.role === role : true))
        .filter((u: any) => {
            const q = name.trim().toLowerCase();
            if (!q) return true;
            const full = `${u.firstName ?? ""} ${u.lastName ?? ""}`.toLowerCase();
            return full.includes(q) || (u.username ?? "").toLowerCase().includes(q);
        });

    return (
        <div id="wd-people-table">
            <div className="d-flex align-items-center gap-2 mb-3">
                <InputGroup style={{ maxWidth: 320 }}>
                    <InputGroup.Text><FaMagnifyingGlass /></InputGroup.Text>
                    <FormControl
                        id="wd-filter-by-name"
                        placeholder="Search people by name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </InputGroup>
                <FormSelect
                    id="wd-filter-by-role"
                    style={{ maxWidth: 200 }}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="STUDENT">Students</option>
                    <option value="TA">Assistants</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="ADMIN">Administrators</option>
                </FormSelect>
                {isFaculty && (
                    <Button variant="danger" className="ms-auto" onClick={createNewUser} id="wd-add-people">
                        <FaPlus className="me-1" /> People
                    </Button>
                )}
            </div>

            <Table striped hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Login ID</th>
                    <th>Section</th>
                    <th>Role</th>
                    <th>Last Activity</th>
                    <th>Total Activity</th>
                    {isFaculty && <th></th>}
                </tr>
                </thead>
                <tbody>
                {shown.map((u: any) => (
                    <tr key={u._id}>
                        <td className="wd-full-name text-nowrap">
                            <FaUserCircle className="me-2 fs-4 text-secondary" />
                            <span
                                role="button"
                                className="text-primary text-decoration-underline"
                                onClick={() => router.push(`/Account/Users/${u._id}`)}
                            >
                                {u.firstName} {u.lastName}
                            </span>
                        </td>
                        <td>{u.loginId}</td>
                        <td>{u.section}</td>
                        <td>{u.role}</td>
                        <td>{u.lastActivity}</td>
                        <td>{u.totalActivity}</td>
                        {isFaculty && (
                            <td className="text-nowrap">
                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    title="Delete"
                                    onClick={() => removeUser(u._id)}
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}
