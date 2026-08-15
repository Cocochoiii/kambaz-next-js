"use client";

// The People screen of one course.
// The server joins the enrollments with the users,
// so this table only shows the people in this course.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "../../../../Account/Users/PeopleTable";
import * as coursesClient from "../../../client";

export default function CoursePeople() {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";

  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const found = await coursesClient.findUsersForCourse(cid);
    setUsers(found);
  };

  useEffect(() => {
    if (cid) {
      fetchUsers();
    }
  }, [cid]);

  return <PeopleTable users={users} />;
}
