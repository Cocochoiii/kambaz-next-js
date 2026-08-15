"use client";

// The panel on the right of the Users screen.
// It reads one user by the uid in the URL.
// Save and Delete go to the server, then tell the list what changed.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Form } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { FaCheck, FaPencil } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { isFacultyNow } from "../roles";
import * as client from "../client";

export default function PeopleDetails({
  onSaved,
  onDeleted,
}: {
  onSaved: (user: any) => void;
  onDeleted: (userId: string) => void;
}) {
  const params = useParams<{ uid: string }>();
  const uid = params ? params.uid : "";
  const router = useRouter();

  const { currentUser, viewAsStudent } = useSelector(
    (state: any) => state.accountReducer
  );
  const isFaculty = isFacultyNow(currentUser, viewAsStudent);
  const [user, setUser] = useState<any>(null);
  // name is the first and the last name in one field.
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);

  const fetchUser = async () => {
    const found = await client.findUserById(uid);
    setUser(found);
    setEditing(false);
  };

  useEffect(() => {
    if (uid) {
      fetchUser();
    }
  }, [uid]);

  // The X closes the panel. The list stays on the screen.
  const close = () => router.push("/Account/Users");

  const saveUser = async () => {
    // The field holds "First Last". So I split it in two.
    const parts = name.split(" ");
    const firstName = editing && parts[0] ? parts[0] : user.firstName;
    const lastName = editing && parts[1] ? parts[1] : user.lastName;
    const updatedUser = { ...user, firstName, lastName };
    const saved = await client.updateUser(updatedUser);
    const result = saved ? saved : updatedUser;
    setUser(result);
    setEditing(false);
    onSaved(result);
  };

  const removeUser = async () => {
    await client.deleteUser(user._id);
    onDeleted(user._id);
    router.push("/Account/Users");
  };

  if (!uid || !user) {
    return null;
  }

  return (
    <div
      className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow overflow-auto"
      style={{ width: 340, zIndex: 1050 }}
    >
      <button
        type="button"
        onClick={close}
        className="btn float-end wd-close-details"
        aria-label="Close"
      >
        <IoCloseSharp className="fs-1" />
      </button>

      <div className="text-center mt-5">
        <FaUserCircle className="text-secondary" style={{ fontSize: 80 }} />
      </div>
      <hr />

      {/* The pencil opens the field. The check saves it. */}
      <div className="text-danger fs-4">
        {!editing && isFaculty && (
          <FaPencil
            role="button"
            aria-label="Edit name"
            onClick={() => {
              setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
              setEditing(true);
            }}
            className="float-end fs-5 mt-2 wd-edit"
          />
        )}
        {editing && (
          <FaCheck
            role="button"
            aria-label="Save name"
            onClick={saveUser}
            className="float-end fs-5 mt-2 me-2 wd-save"
          />
        )}
        {!editing && (
          <div
            role={isFaculty ? "button" : undefined}
            className="wd-name"
            onClick={() => {
              if (!isFaculty) {
                return;
              }
              setName(`${user.firstName || ""} ${user.lastName || ""}`.trim());
              setEditing(true);
            }}
          >
            {user.firstName} {user.lastName}
          </div>
        )}
        {editing && (
          <Form.Control
            className="w-75 wd-edit-name"
            defaultValue={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveUser();
              }
            }}
          />
        )}
      </div>

      <b>Email</b>
      {isFaculty ? (
        <Form.Control
          id="wd-edit-email"
          type="email"
          className="mb-2"
          value={user.email || ""}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      ) : (
        <p className="wd-email">{user.email}</p>
      )}

      <b>Roles</b>
      {isFaculty ? (
        <Form.Select
          id="wd-edit-role"
          className="form-control mb-2"
          value={user.role || "USER"}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
        >
          <option value="STUDENT">Student</option>
          <option value="TA">Assistant</option>
          <option value="FACULTY">Faculty</option>
          <option value="ADMIN">Administrator</option>
          <option value="USER">User</option>
        </Form.Select>
      ) : (
        <p className="wd-roles">{user.role}</p>
      )}

      <b>Login ID</b> <span className="wd-login-id">{user.loginId}</span> <br />
      <b>Section</b> <span className="wd-section">{user.section}</span> <br />
      <b>Total Activity</b>{" "}
      <span className="wd-total-activity">{user.totalActivity}</span>
      <hr />

      {isFaculty && (
        <>
          <Button
            id="wd-save-user"
            onClick={saveUser}
            className="btn btn-primary w-100 mb-2"
          >
            Save
          </Button>
          <Button
            id="wd-delete-user"
            onClick={removeUser}
            className="btn btn-danger w-100 mb-2 wd-delete"
          >
            Delete
          </Button>
        </>
      )}
      <Button
        id="wd-cancel-user"
        onClick={close}
        className="btn btn-secondary w-100 wd-cancel"
      >
        Cancel
      </Button>
    </div>
  );
}
