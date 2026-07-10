"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Table, Form, InputGroup } from "react-bootstrap";
import { FaUserCircle, FaPlus } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import * as client from "../../../../Account/client";
import { useIsFaculty } from "../../../../Account/roles";

export default function PeopleTable() {
    const { cid } = useParams<{ cid: string }>();
    const isFaculty = useIsFaculty();
    const [users, setUsers] = useState<any[]>([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    // Load users enrolled in this course from the server.
    const load = async () => {
        setUsers(await client.findUsersForCourse(cid));
    };
    useEffect(() => {
        load();
    }, [cid]);

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

            <Table striped>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Login ID</th>
                    <th>Section</th>
                    <th>Role</th>
                    <th>Last Activity</th>
                    <th>Total Activity</th>
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
                        <td className="wd-role">{user.role}</td>
                        <td className="wd-last-activity">{user.lastActivity}</td>
                        <td className="wd-total-activity">{user.totalActivity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}
