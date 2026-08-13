"use client";

// The People screen.
// Chapter 3 asks me to show the people of the course I am reading. I read the
// course id (cid) from the URL, then keep only the users that have an
// enrollment in this course. Every person is one row of a Bootstrap table.
// I need "use client" because useParams and React Bootstrap run in the browser.
import { Table } from "react-bootstrap";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import * as db from "../../../../Database";

export default function PeopleTable() {
  const params = useParams<{ cid: string }>();
  const cid = params?.cid;
  const { users, enrollments } = db;

  const courseUsers = users.filter((user) =>
    enrollments.some(
      (enrollment) => enrollment.user === user._id && enrollment.course === cid
    )
  );

  return (
    <div id="wd-people-table">
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
          {courseUsers.map((user) => (
            <tr key={user._id}>
              <td className="wd-full-name text-nowrap">
                <FaUserCircle className="me-2 fs-1 text-secondary" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
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
