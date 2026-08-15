"use client";

// Layout for one course.
// Only a signed in and enrolled user can open a course.
// A Faculty can press Student View to see it as a student.
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import { FaAlignJustify } from "react-icons/fa6";
import { FaGlasses } from "react-icons/fa";
import CourseNavigation from "./Navigation";
import Breadcrumb from "./Breadcrumb";
import ProtectedRoute from "../../Account/ProtectedRoute";
import { setViewAsStudent } from "../../Account/reducer";
import { useIsRealFaculty } from "../../Account/roles";

function CourseContent({ children }: { children: ReactNode }) {
  const params = useParams<{ cid: string }>();
  const cid = params ? params.cid : "";
  const router = useRouter();
  const dispatch = useDispatch();

  const { courses } = useSelector((state: any) => state.coursesReducer);
  const { currentUser, viewAsStudent } = useSelector((state: any) => state.accountReducer);
  const { enrollments } = useSelector((state: any) => state.enrollmentsReducer);
  const isRealFaculty = useIsRealFaculty();

  const course = courses.find((course: any) => course._id === cid);

  const isEnrolled = enrollments.some(
    (enrollment: any) =>
      enrollment.user === currentUser?._id && enrollment.course === cid
  );
  const canOpen = isRealFaculty || isEnrolled;

  useEffect(() => {
    if (!canOpen) {
      router.replace("/Dashboard");
    }
  }, [canOpen, router]);

  if (!canOpen) {
    return null;
  }

  return (
    <div id="wd-courses" style={{ paddingBottom: viewAsStudent ? 64 : undefined }}>
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="text-danger m-0">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course ? course.name : `Course ${cid}`}
          <Breadcrumb />
        </h2>
        {isRealFaculty && !viewAsStudent && (
          <Button
            id="wd-student-view-btn"
            size="sm"
            variant="outline-secondary"
            onClick={() => dispatch(setViewAsStudent(true))}
          >
            <FaGlasses className="me-1" /> Student View
          </Button>
        )}
      </div>
      <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation cid={cid} />
        </div>
        <div className="flex-fill ms-3 wd-course-screen">
          {children}
        </div>
      </div>

      {/* The gray bar Canvas shows during a preview. */}
      {isRealFaculty && viewAsStudent && (
        <div
          className="position-fixed bottom-0 start-0 end-0 d-flex justify-content-between align-items-center px-4 py-2"
          style={{ background: "#6c757d", color: "#fff", zIndex: 1050 }}
        >
          <span>
            <FaGlasses className="me-2" />
            You are viewing this course as a student.
          </span>
          <Button
            id="wd-leave-student-view-btn"
            size="sm"
            variant="light"
            onClick={() => dispatch(setViewAsStudent(false))}
          >
            Leave Student View
          </Button>
        </div>
      )}
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
