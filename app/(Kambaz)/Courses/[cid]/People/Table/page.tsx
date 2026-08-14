"use client";

// The People screen. It shows the users enrolled in this course.
// The server joins the users and the enrollments.
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import * as coursesClient from "../../../client";

export default function PeopleTable() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [courseUsers, setCourseUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const found = await coursesClient.findUsersForCourse(cid);
    setCourseUsers(found);
  };

  useEffect(() => {
    if (cid) {
      fetchUsers();
    }
  }, [cid]);

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
          {courseUsers.map((user: any) => (
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
