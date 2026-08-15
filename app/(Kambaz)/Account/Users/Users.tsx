"use client";

// The Users screen. It shows every user in the database.
// The two filters ask the server, so the database does the work.
// + People inserts a new user and opens it for editing.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import PeopleTable from "./PeopleTable";
import PeopleDetails from "./PeopleDetails";
import { useIsFaculty } from "../roles";
import * as client from "../client";

export default function Users() {
  const params = useParams<{ uid: string }>();
  const uid = params ? params.uid : "";
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const isFaculty = useIsFaculty();

  const fetchUsers = async () => {
    const found = await client.findAllUsers();
    setUsers(found);
  };

  // One filter at a time, the way the book does it.
  const filterUsersByRole = async (role: string) => {
    setRole(role);
    setName("");
    if (role) {
      setUsers(await client.findUsersByRole(role));
    } else {
      fetchUsers();
    }
  };

  const filterUsersByName = async (name: string) => {
    setName(name);
    setRole("");
    if (name) {
      setUsers(await client.findUsersByPartialName(name));
    } else {
      fetchUsers();
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // A new user with default fields. The username must be new.
  const createUser = async () => {
    const stamp = new Date().getTime();
    const created = await client.createUser({
      firstName: "New",
      lastName: `User${users.length + 1}`,
      username: `newuser${stamp}`,
      password: "password123",
      email: `email${users.length + 1}@neu.edu`,
      role: "STUDENT",
      section: "S101",
      loginId: `NEW${stamp}`,
      lastActivity: "",
      totalActivity: "",
    });
    setUsers([created, ...users]);
    router.push(`/Account/Users/${created._id}`);
  };

  // The panel tells me what changed. Then the table changes too.
  const onSaved = (user: any) =>
    setUsers(users.map((u: any) => (u._id === user._id ? user : u)));
  const onDeleted = (userId: string) =>
    setUsers(users.filter((u: any) => u._id !== userId));

  return (
    <div id="wd-users-screen">
      <h3>Users</h3>

      <div className="d-flex align-items-center mb-3" style={{ gap: 8 }}>
        <Form.Control
          id="wd-filter-by-name"
          className="wd-filter-by-name"
          style={{ maxWidth: 260 }}
          placeholder="Search people"
          value={name}
          onChange={(e) => filterUsersByName(e.target.value)}
        />
        <Form.Select
          id="wd-select-role"
          className="wd-select-role"
          style={{ maxWidth: 220 }}
          value={role}
          onChange={(e) => filterUsersByRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="TA">Assistants</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrators</option>
        </Form.Select>
        {isFaculty && (
          <Button
            id="wd-add-people"
            variant="danger"
            className="ms-auto wd-add-people"
            onClick={createUser}
          >
            <FaPlus className="me-2" />
            People
          </Button>
        )}
      </div>

      <PeopleTable users={users} />

      {/* The panel only shows when the URL carries a uid. */}
      {uid && <PeopleDetails onSaved={onSaved} onDeleted={onDeleted} />}
    </div>
  );
}
