"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Table, Form, InputGroup, Button } from "react-bootstrap";
import { FaUserCircle, FaPlus, FaTrash } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import * as client from "../../../../Account/client";
import * as enrollmentsClient from "../../../../Enrollments/client";
import { useIsFaculty } from "../../../../Account/roles";

const ROLES = ["STUDENT", "TA", "FACULTY", "ADMIN"];

export default function PeopleTable() {
    const { cid } = useParams<{ cid: string }>();
    const isFaculty = useIsFaculty();
    const [users, setUsers] = useState<any[]>([]);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");
    const [addUserId, setAddUserId] = useState("");

    // Load users enrolled in this course; faculty also load everyone (to add).
    const load = async () => {
        setUsers(await client.findUsersForCourse(cid));
        if (isFaculty) {
            setAllUsers(await client.findAllUsers());
        }
    };
    useEffect(() => {
        load();
    }, [cid, isFaculty]);

    // Faculty actions: enroll another user, remove one, or change a role.
    const handleAdd = async () => {
        if (!addUserId) return;
        await enrollmentsClient.enrollIntoCourse(addUserId, cid);
        setAddUserId("");
        await load();
    };
    const handleRemove = async (userId: string) => {
        await enrollmentsClient.unenrollFromCourse(userId, cid);
        await load();
    };
    const handleRoleChange = async (user: any, newRole: string) => {
        await client.updateUser({ ...user, role: newRole });
        await load();
    };

    const enrolledIds = users.map((u: any) => u._id);
    const notEnrolled = allUsers.filter((u: any) => !enrolledIds.includes(u._id));

    const visible = users
        .filter((u: any) => !role || (u.role || "").toUpperCase() === role)
        .filter((u: any) =>
            `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(search.toLowerCase())
        );

    return (
        <div id="wd-people-table">
            {/* Search + role filter for everyone; only faculty get "+ People". */}
            <div className="d-flex align-items-center gap-2 mb-3">
                <InputGroup style={{ maxWidth: 320 }}>
                    <InputGroup.Text><BsSearch /></InputGroup.Text>
                    <Form.Control
                        placeholder="Search people"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </InputGroup>
                <Form.Select style={{ maxWidth: 180 }} value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">All Roles</option>
                    <option value="STUDENT">Students</option>
                    <option value="TA">Assistants</option>
                    <option value="FACULTY">Faculty</option>
                </Form.Select>
                {isFaculty && (
                    <Link href="/Account/Users" className="btn btn-danger ms-auto">
                        <FaPlus className="me-1" /> People
                    </Link>
                )}
            </div>

            {/* Faculty: enroll an existing user into this course. */}
            {isFaculty && (
                <div className="d-flex align-items-center gap-2 mb-3">
                    <Form.Select
                        style={{ maxWidth: 360 }}
                        value={addUserId}
                        onChange={(e) => setAddUserId(e.target.value)}
                    >
                        <option value="">Add a person to this course…</option>
                        {notEnrolled.map((u: any) => (
                            <option key={u._id} value={u._id}>
                                {u.firstName} {u.lastName} ({u.role})
                            </option>
                        ))}
                    </Form.Select>
                    <Button variant="success" onClick={handleAdd} disabled={!addUserId}>
                        <FaPlus className="me-1" /> Add
                    </Button>
                </div>
            )}

            <Table striped>
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
                {visible.map((user: any) => (
                    <tr key={user._id}>
                        <td className="wd-full-name text-nowrap">
                            <FaUserCircle className="me-2 fs-1 text-secondary" />
                            {isFaculty ? (
                                <Link href={`/Account/Users/${user._id}`} className="text-decoration-none">
                                    <span className="wd-first-name">{user.firstName}</span>{" "}
                                    <span className="wd-last-name">{user.lastName}</span>
                                </Link>
                            ) : (
                                <span>
                                    <span className="wd-first-name">{user.firstName}</span>{" "}
                                    <span className="wd-last-name">{user.lastName}</span>
                                </span>
                            )}
                        </td>
                        <td className="wd-login-id">{user.loginId}</td>
                        <td className="wd-section">{user.section}</td>
                        <td className="wd-role">
                            {isFaculty ? (
                                <Form.Select
                                    size="sm"
                                    style={{ maxWidth: 150 }}
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                >
                                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                                </Form.Select>
                            ) : (
                                user.role
                            )}
                        </td>
                        <td className="wd-last-activity">{user.lastActivity}</td>
                        <td className="wd-total-activity">{user.totalActivity}</td>
                        {isFaculty && (
                            <td>
                                <Button
                                    variant="link"
                                    className="text-danger p-0"
                                    title="Remove from course"
                                    onClick={() => handleRemove(user._id)}
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
