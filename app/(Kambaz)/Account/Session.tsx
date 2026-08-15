"use client";

// A reload empties the store, but the server still has my session.
// So I ask the server who I am before I draw anything.
// While I wait I draw nothing. If not, ProtectedRoute would sign me out.
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { setCourses } from "../Courses/reducer";
import { setEnrollments } from "../Enrollments/reducer";
import * as accountClient from "./client";
import * as coursesClient from "../Courses/client";

export default function Session({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();

  const fetchSession = async () => {
    // The courses are public. The menu needs them too.
    try {
      const courses = await coursesClient.fetchAllCourses();
      dispatch(setCourses(courses));
    } catch (error) {
      // The server may be asleep. Then there are no courses.
    }

    try {
      const currentUser = await accountClient.profile();
      dispatch(setCurrentUser(currentUser));

      // My courses become my enrollments.
      const myCourses = await accountClient.findMyCourses();
      dispatch(
        setEnrollments(
          myCourses.map((course: any) => ({
            _id: `${currentUser._id}-${course._id}`,
            user: currentUser._id,
            course: course._id,
          }))
        )
      );
    } catch (error) {
      // No session. The visitor stays signed out.
    }

    setPending(false);
  };

  useEffect(() => {
    fetchSession();
  }, []);

  if (pending) {
    return null;
  }
  return <>{children}</>;
}
