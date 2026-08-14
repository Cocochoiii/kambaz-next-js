"use client";

// Layout for one course.
// 4.9 The course name comes from the store, so a new course has a name.
// 4.11 and 4.13 Only a signed in and enrolled user can open a course.
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { FaAlignJustify } from "react-icons/fa6";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import ProtectedRoute from "../../Account/ProtectedRoute";

function CourseContent({ children }: { children: ReactNode }) {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const router = useRouter();

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);

  const course = courses.find((course: any) => course._id === cid);

  const isEnrolled = enrollments.some(
    (enrollment: any) =>
      enrollment.user === currentUser?._id && enrollment.course === cid
  );
  const canOpen = currentUser?.role === "FACULTY" || isEnrolled;

  useEffect(() => {
    if (!canOpen) {
      router.replace("/Dashboard");
    }
  }, [canOpen, router]);

  if (!canOpen) {
    return null;
  }

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course ? course.name : `Course ${cid}`}
        <Breadcrumb />
      </h2>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill ms-3 wd-course-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function CoursesLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <ProtectedRoute>
      <CourseContent>{children}</CourseContent>
    </ProtectedRoute>
  );
}
